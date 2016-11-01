CHUNOApp.controller('ToolDBTableConfigController', ['$scope', 'NgTableParams', '$q', '$timeout',
    function ($scope, NgTableParams, $q, $timeout) {
        var self = this;
        //========================================================
        //test
        self.selectvalue = '3';
        self.Message = "Message Child";
        self.parentMessage = $scope.$parent.Message;
        self.parentMessage2 = $scope.ctrl.Message;

        self.DBChildTableId_TableName = "Chumano";
        //========================================================
        //Controller Properties
        self.IsCreatingView = false
        self.list_viewtype = [
            { id: "SINGLE_VIEW", name: "Single-View" },
            { id: "MASTER_DETAIL", name: "Master-Detail" },
            { id: "EDIT_ON_TABLE", name: "Edit-On-Fly-Table" }]
        self.viewtype = "SINGLE_VIEW";

        self.TableConfigObject = new DataObject("T_Tool_ConfigTable", $scope);
        self.TableConfigObject._CanCreate = true;
        self.TableConfigObject._CanUpdate = true;
        self.TableConfigObject._CanDelete = true;

        self.ChildConfigObject = new DataObject("T_Tool_ConfigTableChild", $scope);
        self.ChildConfigObject._CanCreate = true;
        self.ChildConfigObject._CanUpdate = true;
        self.ChildConfigObject._CanDelete = true;

        $scope.ChildObject.set = function (object) {
            self.Message = "Copied object";
            self.ObjectForm = object;

            //init - data
            self.TableConfigForm.LoadData();
            self.ChildTableForm.LoadData();
        };

        

        self.TableConfigForm = new TableConfigForm(self, NgTableParams);
        self.ChildTableForm = new ChildTableForm(self, NgTableParams);

        //===========================================================
        self.LoadColumnInfos = function (isupdate) {
            ShowConfirmModal("Tạo [Column Infos] từ Cơ sở dữ liệu!", function () {
                var result = AjaxSync(_tool_service_generatetableconfig,JSON.stringify( { tableid :  self.ObjectForm.Id , isupdate : isupdate}));
                if (result) {
                    ShowSuccessMessage("Đã tạo xong");
                    self.TableConfigForm.LoadData();

                    self.ChildTableForm.LoadData();
                }
            });
        }

        self.LoadChildTables = function () {
            ShowConfirmModal("Tạo [Child Tables] từ Cơ sở dữ liệu!", function () {
                var result = AjaxSync(_tool_service_generatechildtableconfig, JSON.stringify({ tableid: self.ObjectForm.Id }));
                if (result) {
                    ShowSuccessMessage("Đã tạo xong");
                    self.ChildTableForm.LoadData();
                }
            });
        }

        self.CreateView = function () {
            self.IsCreatingView = true;
            $timeout(function () {
                var result = AjaxSync(_tool_service_createview, JSON.stringify({ tableid: self.ObjectForm.Id , viewtype : self.viewtype }));
                if (result) {
                    ShowSuccessMessage("Đã tạo xong");
                }
                self.IsCreatingView = false;
            }, 100);
        }

        self.PreView = function () {
            var viewname = self.ObjectForm.TableName;
            var url = "/Tool/TView/" + viewname;
            CommonHelper.OpenInNewTab(url);
        }
    }]
);


function TableConfigForm(ctrl, NgTableParams) {
    //=================================================
    //TABLE FORM
    //=================================================
    var self = this;
    //control variable
    self.isEdditing = false;
    self.isAdding = false;
    self.deleteCount = 0;

    self._controller = ctrl;
    //self._tableForm = tableForm;
    //self._tableTracker = tableTracker;

    //data form
    self.totalData = 0;
    self.data = [];

    //========================================
    //table params
    self.tableParams = new NgTableParams({
        //count , page , sorting, filter 
        count: 10,
        page: 1
    }, {
        total: self.totalData,
        counts: [10, 20, 50, 100],
        // determines the pager buttons (left set of buttons in demo)
        paginationMaxBlocks: 13,
        paginationMinBlocks: 2,

        /////////////////////////
        dataset: angular.copy(self.data)
    });

    //========================================
    self.cancel = cancel;
    self.save = save;
    self.edit = edit;
    self.del = del;

    self.add = add;
    self.cancelChanges = cancelChanges;
    self.hasChanges = hasChanges;
    self.saveChanges = saveChanges;

    self.changeFilter = changeFilter; //chưa thấy dùng
    //////////

    function cancelChanges() {
        resetTableStatus();
        var currentPage = self.tableParams.page();
        self.tableParams.settings({
            dataset: angular.copy(self.data)
        });
        // keep the user on the current page when we can
        if (!self.isAdding) {
            self.tableParams.page(currentPage);
        }
    }

    function hasChanges() {
        return self._tableForm.$dirty || self.deleteCount > 0
    }

    function resetTableStatus() {
        self.isEditing = false;
        self.isAdding = false;
        self.deleteCount = 0;
        self._tableTracker.reset();
        self._tableForm.$setPristine();


    }

    function saveChanges() {
        resetTableStatus();
        var currentPage = self.tableParams.page();
        self.data = angular.copy(self.tableParams.settings().dataset);
    }

    function add() {
        //self.isEditing = true;
        self.isAdding = true;
        var newRow = {
            TableName: "",
            TableTitle: "",
            IsActive: true,
            Version: 1,
            isEditing: true
        };
        self.tableParams.settings().dataset.unshift(newRow);
        // we need to ensure the user sees the new row we've just added.
        // it seems a poor but reliable choice to remove sorting and move them to the first page
        // where we know that our new item was added to
        self.tableParams.sorting({});
        self.tableParams.page(1);
        self.tableParams.reload();
    }

    ///////////////////////////////////////////////////////
    function cancel(row, rowForm) {
        var originalRow = resetRow(row, rowForm);

        //-------------------------------
        if (originalRow != undefined)
            angular.extend(row, originalRow); //load old data
        else
            del(row); //delete the new row
    }

    function edit(row, rowForm) {
        row.isEditing = true;
    }

    function del(row) {
        var index = self.tableParams.settings().dataset.indexOf(row);
        ShowConfirmModal("Bạn có muốn xóa \"" + row.ColumnName + "\" không?", function () {
            //------------xóa------------------
            var FormObject = self._controller.TableConfigObject;
            //FormObject.SetObject(row);
            var result = FormObject.DeleteObject(row.Id);
            if (result) {
                self.LoadData();
            }
           
        });
    }

    function save(row, rowForm) {
        var FormObject = self._controller.TableConfigObject;
        FormObject.SetObject(row);

        var result = FormObject.SaveObject(); //result is Id

        //nếu là thêm mới thì reload lại
        if (result && row.Id == undefined) {
            self.LoadData();
            return;
        }

        if (result) {
            var originalRow = resetRow(row, rowForm);
            angular.extend(originalRow, row);
        }


    }

    function resetRow(row, rowForm) {
        row.isEditing = false;
        rowForm.$setPristine();
        self._tableTracker.untrack(row);
        if (row.Id == undefined) return undefined;

        //return row
        return _.find(self.data, { 'Id': row.Id });
    }

    function changeFilter(field, value) {
        var filter = {};
        filter[field] = value;
        angular.extend(self.tableParams.filter(), filter);
    }
    //===================================================
    self.LoadData = function () {
        //self._controller.showloading();
        //===========================       
        var dataService = new DataService({});
        dataService.config = {};
        dataService.config.dataobject = 'T_TOOL_ConfigTable';
        dataService.config.columns = '*'

        dataService.config.sort = 'Id ASC';
        dataService.config.condition = 'DBTableId=' + self._controller.ObjectForm.Id
                                        + ' AND (T_TOOL_ConfigTable.IsActive=1 or T_TOOL_ConfigTable.IsActive is NULL) ';
        dataService.config.action = 'getall'; //getall/get
        dataService.config.startrow = 0;
        dataService.config.endrow = 0;


        //=================================
        setTimeout(function () {
            self.totalData = dataService.CountListData();
            self.data = dataService.GetListData();
            self.tableParams.settings({
                total: self.totalData,
                dataset: angular.copy(self.data)
            });
            self.tableParams.reload();

        }, 100);
    };


}

function ChildTableForm(ctrl, NgTableParams) {
    //=================================================
    //TABLE FORM
    //=================================================
    var self = this;
    //control variable
    self.isEdditing = false;
    self.isAdding = false;
    self.deleteCount = 0;

    self._controller = ctrl;
    //self._tableForm = tableForm;
    //self._tableTracker = tableTracker;

    //data form
    self.totalData = 0;
    self.data = [];

    //========================================
    //table params
    self.tableParams = new NgTableParams({
        //count , page , sorting, filter 
        count: 10,
        page: 1
    }, {
        total: self.totalData,
        counts: [10, 20, 50, 100],
        // determines the pager buttons (left set of buttons in demo)
        paginationMaxBlocks: 13,
        paginationMinBlocks: 2,

        /////////////////////////
        dataset: angular.copy(self.data)
    });

    //========================================
    self.cancel = cancel;
    self.save = save;
    self.edit = edit;
    self.del = del;

    self.add = add;
    self.cancelChanges = cancelChanges;
    self.hasChanges = hasChanges;
    self.saveChanges = saveChanges;

    self.changeFilter = changeFilter; //chưa thấy dùng
    //////////

    function cancelChanges() {
        resetTableStatus();
        var currentPage = self.tableParams.page();
        self.tableParams.settings({
            dataset: angular.copy(self.data)
        });
        // keep the user on the current page when we can
        if (!self.isAdding) {
            self.tableParams.page(currentPage);
        }
    }

    function hasChanges() {
        return self._tableForm.$dirty || self.deleteCount > 0
    }

    function resetTableStatus() {
        self.isEditing = false;
        self.isAdding = false;
        self.deleteCount = 0;
        self._tableTracker.reset();
        self._tableForm.$setPristine();


    }

    function saveChanges() {
        resetTableStatus();
        var currentPage = self.tableParams.page();
        self.data = angular.copy(self.tableParams.settings().dataset);
    }

    function add() {
        //self.isEditing = true;
        self.isAdding = true;
        var newRow = {
            TableName: "",
            TableTitle: "",
            IsActive: true,
            Version: 1,
            isEditing: true
        };
        self.tableParams.settings().dataset.unshift(newRow);
        // we need to ensure the user sees the new row we've just added.
        // it seems a poor but reliable choice to remove sorting and move them to the first page
        // where we know that our new item was added to
        self.tableParams.sorting({});
        self.tableParams.page(1);
        self.tableParams.reload();
    }

    ///////////////////////////////////////////////////////
    function cancel(row, rowForm) {
        var originalRow = resetRow(row, rowForm);

        //-------------------------------
        if (originalRow != undefined)
            angular.extend(row, originalRow); //load old data
        else
            del(row); //delete the new row
    }

    function edit(row, rowForm) {
        row.isEditing = true;
    }

    function del(row) {
        var index = self.tableParams.settings().dataset.indexOf(row);
        ShowConfirmModal("Bạn có muốn xóa \"" + row.DBChildTableId + "\" không?", function () {
            //------------xóa------------------
            var FormObject = self._controller.ChildConfigObject;
            //FormObject.SetObject(row);
            var result = FormObject.DeleteObject(row.Id);
            if (result) {
                self.LoadData();
            }

        });
    }

    function save(row, rowForm) {
        var FormObject = self._controller.ChildConfigObject;
        FormObject.SetObject(row);

        var result = FormObject.SaveObject(); //result is Id

        //nếu là thêm mới thì reload lại
        if (result && row.Id == undefined) {
            self.LoadData();
            return;
        }

        if (result) {
            var originalRow = resetRow(row, rowForm);
            angular.extend(originalRow, row);
        }


    }

    function resetRow(row, rowForm) {
        row.isEditing = false;
        rowForm.$setPristine();
        self._tableTracker.untrack(row);
        if (row.Id == undefined) return undefined;

        //return row
        return _.find(self.data, { 'Id': row.Id });
    }

    function changeFilter(field, value) {
        var filter = {};
        filter[field] = value;
        angular.extend(self.tableParams.filter(), filter);
    }
    //===================================================
    self.LoadData = function () {
        //self._controller.showloading();
        //===========================       
        var dataService = new DataService({});
        var config = new DataFormConfig();
        config.dataobject = 'T_Tool_ConfigTableChild';
        config.columns = 'Id;DBTableId;DBChildTableId;RefColumn;DBChildTableId.TableName,DBChildTableId_TableName;IsOnlyOne;ChildType;IsUse';

        config.sort = 'Id ASC';
        config.condition = 'DBTableId=' + self._controller.ObjectForm.Id
                        + ' AND (T_Tool_ConfigTableChild.IsActive=1 or T_Tool_ConfigTableChild.IsActive is NULL) ';

        config.action = 'getall'; //getall/get
        config.startrow = 0;
        config.endrow = 0;
        dataService.config = config;

        //=================================
        setTimeout(function () {
            self.totalData = dataService.CountListData();
            self.data = dataService.GetListData();
            self.tableParams.settings({
                total: self.totalData,
                dataset: angular.copy(self.data)
            });
            self.tableParams.reload();

        }, 100);
    };


}