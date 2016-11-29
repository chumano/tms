//User for single object
function DataObject(tableName, $scope) {

    this.TableName = tableName; //main table
    this.SubTableName = ""; // child table (optional)

    this.ObjectData = {}; //store a object
    this.ListObjectData = []; //store list of objects

    this.$scope = $scope;
    this._CanCreate = false;

    this.SetSubTableName = function (subTableName) {
        this.SubTableName = subTableName;
    }

    this.SetObject = function (objectData) {
        this.ObjectData = objectData;
    }

    this.SetListObject = function (listObjectData) {
        this.ListObjectData = listObjectData;
    }

    this.SaveObject = function () {
        var result = AjaxSync(_data_service_saveobject, '{ tableName: "' + this.TableName + '", data: "' + this.GetCombinedData(this.ObjectData) + '"}');

        if(this.ReloadMasterData)
            this.ReloadMasterData(this.TableName);

        if (this.ObjectData.Version != undefined && result > 0) {
            this.ObjectData.Version++;
        }

        return result;
    }

    this.SaveComplexObject = function () {
        var data = "";
        for (var i = 0; i < this.ListObjectData.length; i++) {
            if (data) {
                data += "<<>>";
            }
            data += this.GetCombinedData(this.ListObjectData[i]);
        }
        var result = AjaxSync(_data_service_savecomplexobject, '{ tableName: "' + this.TableName + '", data: "' + this.GetCombinedData(this.ObjectData) + '", subObject: "' + this.SubTableName + '", listData: "' + data + '"}');

        if (this.ObjectData.Version != undefined && result > 0) {
            this.ObjectData.Version++;
        }

        return result;
    }

    this.SaveListObject = function () {
        var data = "";
        for (var i = 0; i < this.ListObjectData.length; i++) {
            if (data) {
                data += "<<>>";
            }
            data += this.GetCombinedData(this.ListObjectData[i]);
        }
        var result = AjaxSync(_data_service_savelistobject, '{ tableName: "' + this.TableName + '", data: "' + data + '"}');
        return result;
    }

    //If colum is null, it will get primary key
    this.GetObject = function (columValue, columName) {
        if (columName == undefined) columName = "";
        return AjaxSync(_data_service_getobject, '{ tableName: "' + this.TableName + '", columName : "' + columName + '", columValue: "' + columValue + '"}');
    }

    //
    this.DeleteObject = function (keyValue) {
        var result = AjaxSync(_data_service_deleteobject, '{ tableName: "' + this.TableName + '", keyValue: ' + keyValue + '}');

        if(this.ReloadMasterData)
            this.ReloadMasterData(this.TableName);

        return result;
    }

    //
    this.HardDeleteObject = function (keyValue) {
        var result = AjaxSync(_data_service_deleteobject, '{ tableName: "' + this.TableName + '", keyValue: ' + keyValue + ', isHardDelete: true}');

        this.ReloadMasterData(this.TableName);

        return result;
    }

    this.CheckCanCreateObject = function () {

        var thisObject = this;
        AjaxAsync(g_checkCanCreateObjectUrl, '{ tableName: "' + this.TableName + '"}', function (result) {
            thisObject.$scope.$applyAsync(function () {
                thisObject._CanCreate = result;
            });
        });
    }

    this.CheckField = function (field) {
        var result = AjaxSync(g_checkFieldUrl, '{ field: "' + field + '"}');

        return result;
    }

    //this.CheckCanCreateObject();

    this.RemoveSpecialChars = function (str) {
        if (str == null || str == undefined) return "";
        str = String(str);
        while (str.indexOf("::") >= 0) {
            str = str.replace(/::/g, ':');
        }
        while (str.indexOf(",,") >= 0) {
            str = str.replace(/,,/g, ',');
        }
        while (str.indexOf("<<>>") >= 0) {
            str = str.replace(/<<>>/g, '');
        }
        str = str.replace(/"/g, '\\"');
        return str;
    }

    this.GetCombinedData = function (object) {

        var result = "";

        for (var key in object) {
            var value = object[key];
            if (result) {
                result += ",,";
            }
            result += this.RemoveSpecialChars(key) + "::" + this.RemoveSpecialChars(value);
        }

        return result;
    }

    this.CopyFields = function (fromObject, toObject) {
        //// Merge object2 into object1
        //$.extend( object1, object2 );

        if (toObject == undefined)
            toObject = {};

        //===================
        //copy chỉ những cái toObject cần (nghĩa là nó đang có thuộc tính đó)
        for (var key in fromObject) {
            var value = fromObject[key];
            if (toObject[key] != undefined) {
                if (value != null && value != undefined) {
                    toObject[key] = value;// + "";
                }
                else {
                    toObject[key] = "";
                }
            }
        }
    }

    this.ReloadMasterData = function (tableName) {
        if(this.$scope.ReloadMasterDrodowns)
            this.$scope.ReloadMasterDrodowns(tableName);
    }
}

function DataFormConfig() {
    this.type = "table";//table/function

    this.numdata = 5;
    this.action = "get";//getall/get/get10/sum/count/excel
    this.dataobject = "table"; //tableanme or functionname
    this.columns = ""; //columns are separate by  comma , 
    this.functionparameters = "";
    this.sort = "";  //sql sort 
    this.condition = ""; //sql condition without where

    this.startrow = 0; //get all data if 0, then get data at page
    this.endrow = 0;
}

function DataService(conf) {
    this.config = new DataFormConfig();
    if (conf) this.config = conf;
    
   
    this._interpolate = function ($interpolate, $scope) {
        this.config.columns = $interpolate(this.config.columns)($scope);
        this.config.sort = $interpolate(this.config.sort)($scope);
        this.config.condition = $interpolate(this.config.condition)($scope);
        return;
    }

    this.CountListData = function () {
        return AjaxSync(_data_service_count, '{ config: ' + JSON.stringify(this.config) + '}');
    }


    this.GetListData = function () {
        return AjaxSync(_data_service_getdata, '{ config: ' + JSON.stringify(this.config) + '}');
    }

    this.GetListDataAsync = function (_func) {
        return AjaxAsync(_data_service_getdata, '{ config: ' + JSON.stringify(this.config) + '}', _func);
    }

    this.SumListData = function () {
        if (this.GridSumColums) {
            return AjaxSync(g_sumDataListUrl, '{ config: ' + JSON.stringify(this.config) + '}');
        }
        else {
            return {};
        }
    }

    this.ExportDataToExcel = function (template, objectData) {
        AjaxAsync(g_exportExcelAjaxUrl, '{ template : "' + template + '", objectData : ' + JSON.stringify(objectData) + ', gridConfig: ' + JSON.stringify(this) + '}',
            function () {
                window.location = g_exportExcelUrl;
            });
    }

    this.NormalizeColumName = function (columName) {
        if (!columName) return "";
        var result = "";
        var isOpen = false;
        var fieldName = "";
        for (var i = 0 ; i < columName.length ; i++) {
            if (columName[i] == '[') {
                isOpen = true;
            }
            else if (columName[i] == ']') {
                isOpen = false;
                if (fieldName.indexOf(".") < 0) {
                    result += this.GridDataObject + ".";
                }
                result += fieldName;

                //if field name not existed, we must declare in colums
                if ($.inArray(fieldName, this.ListDefinedColums) == -1) {
                    if (this.GridDefinedColums) {
                        this.GridDefinedColums += ";";
                    }
                    this.GridDefinedColums += "#" + fieldName;
                    this.ListDefinedColums.push(fieldName);
                }

                fieldName = "";
            }
            else {
                if (isOpen) {
                    fieldName += columName[i];
                }
                else {
                    result += columName[i];
                }
            }
        }
        return result;
    }
}