function ShowErrorMessage(message) {
    $.notify(message, "error");
   
}

function ShowSuccessMessage(message) {
    $.notify(message, "success");
}

jQuery.fn.redraw = function () {
    return this.hide(0, function () {
        $(this).show();
    });
};

function ShowLoading() {
    //$("div#main").showLoading();
    return;
    if ($('button.search i.fa.loading').length == 0) {
        
        $('button.search i.fa').hide().after('<i class="fa fa-spinner white loading"></i>');
        $('button.search').redraw();
    }
}

function HideLoading() {
    //$("div#main").hideLoading();
    return;
    var loading = $('button i.fa.loading');
    loading.prev().show();
    loading.remove();
}

function ShowConfirmModal(msg, okfunc) {
    $("#confirmModal .modal-message").html(msg);
    $("#confirmModal button.modal-ok").unbind('click'); //must have to unbind, otherwise duplicate event is called
    $("#confirmModal button.modal-ok").click(function () {
        okfunc();
        $("#confirmModal").modal('hide');
    });
    //==================================
    $("#confirmModal").modal('show');
    $('#confirmModal').on('shown.bs.modal', function () {
        $("#confirmModal button.modal-ok").focus();
    });
}
//===================================================================================
function AjaxSync(service, para) {
    var result = null;
    $.ajax({
        type: "POST",
        url: service,
        data: para,
        contentType: "application/json",
        async: false,
        beforeSend: ShowLoading,
        complete: HideLoading,
        success: function (data) {
            if (typeof (data) == 'string' && data.startsWith("#error")) {
                ShowErrorMessage(data);
                result = null;
            }
            else {
                result = data;
            }
        },
        error: function (e) {
            result = [];
            ShowErrorMessage(e.status + " : " + e.statusText);
        }
    });
    return result;
}

function AjaxAsync(service, para, _func) {
    var result = null;
    $.ajax({
        type: "POST",
        url: service,
        data: para,
        contentType: "application/json",
        beforeSend: ShowLoading,
        complete: HideLoading,
        success: function (data) {
            if (typeof (data) == 'string' && data.startsWith("#error")) {
                ShowErrorMessage(data);
                result = null;
            }
            else {
                result = data;
            }

            //===============
            _func(result);
        },
        error: function (e) {
            result = [];
            ShowErrorMessage(e.status + " : " + e.statusText);

            //===============
            _func(result);
        }
    });
}

//===================================================================================
var CommonHelper = {};
CommonHelper.CopyNeedFields= function (fromObject, toObject) {
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
                toObject[key] = value + "";
            }
            else {
                toObject[key] = "";
            }
        }
    }
}

CommonHelper.IsNullOrEmpty = function (str) {
    if (str != "" && str != undefined || typeof (str) === "boolean")
        return false;
    return true;
}

CommonHelper.IsSearchableValue = function (val) {
    if (val != undefined && val != '' && val != 0 && !isNaN(val))
        return true;
    return false;
}

CommonHelper.GetImageSrc = function (imgid) {
    return _data_service_getimage + "/" + imgid;
}

CommonHelper.CreateCondition = function (key,data) {
    var type = typeof (data);
    var cond = '1=1';
    switch (type) {
        case 'number':
            cond = key + ' = ' + data;
            break;
        case 'string':
            cond = key + ' like N\'\'%' + data + '%\'\'';
            break;
        case 'boolean':
            cond = key + ' = ' + (data?1:0);
            break;
    }
    return cond;
}

CommonHelper.CopyFields = function (fromObject, toObject) {
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

CommonHelper.OpenInNewTab = function(url) {
    var win = window.open(url, '_blank');
    win.focus();
}

//===================================================================================
function DynamicTableForm(NgTableParams, $q, ctrl, getConfig) {
    //=================================================
    //TABLE FORM
    //=================================================
    var self = this;

    //control variable
    self.deleteCount = 0;
    self._controller = ctrl;

    //data form
    self.totalData = 0;
    self.data = [];

    //==========================================
    self.loadData = function (params) {
        if (self._controller.showloading) self._controller.showloading();
        var _this = self.TableForm;

        var filter = params.filter();
        var sorting = params.sorting();
        var pagesize = params.count();
        var page = params.page();
        //===========================       
        var config = getConfig(params);

        //paging
        config.numdata = pagesize;
        config.startrow = (page - 1) * pagesize + 1;
        config.endrow = (page) * pagesize;

        var dataService = new DataService({});
        dataService.config = config;


        //=================================
        var deferred = $q.defer();
        setTimeout(function () {
            var count = dataService.CountListData();
            var ds = dataService.GetListData();

            self.tableParams.total(count);
            self.totalData = count;
            self.data = ds;


            if (self._controller.hideloading) self._controller.hideloading();
            deferred.resolve(ds);
        }, 100);

        //===========================================
        var dataset = deferred.promise;
        return dataset;
    }
    //========================================
    //table params
    self.tableParams = new NgTableParams({
        //count , page , sorting, filter 
        count: 10,
        page: 1
    }, {
        total: self.totalData,
        counts: [10, 20, 50],
        // determines the pager buttons (left set of buttons in demo)
        paginationMaxBlocks: 13,
        paginationMinBlocks: 2,

        /////////////////////////
        getData: self.loadData
    });

    //========================================
    self.search = function (filterobj) {

        self.tableParams.filter(filterobj);

        self.tableParams.reload();
    }

    ///////////////////////////////////////////////////////

    self.reload = function () {
        // we need to ensure the user sees the new row we've just added.
        // it seems a poor but reliable choice to remove sorting and move them to the first page
        // where we know that our new item was added to
        self.tableParams.sorting({});
        self.tableParams.page(1);
        self.tableParams.reload();
    }



}

function StaticTableForm(NgTableParams, $q, ctrl, $scope, getConfig) {
    //=================================================
    //TABLE FORM
    //=================================================
    var self = this;
    //control variable
    self.isEditing = false;
    self.isAdding = false;
    self.deleteCount = 0;

    self._controller = ctrl;
    //_controller : showloading(), hideloading(), 
    //NewObject(), Edit(row, rowForm),
    //SaveObject(row) ,DeleteObject(), ReloadTable()
    //data form
    self.totalData = 0;
    self.data = [];

    //================================================
    //loaddata
    self.loadData = function () {
        if (self._controller.showloading) self._controller.showloading();
        var config = getConfig(self.tableParams);

        var dataService = new DataService({});
        dataService.config = config;
        //=================================
        setTimeout(function () {
            var count = dataService.CountListData();
            var ds = dataService.GetListData();

            self.tableParams.total(count);
            self.totalData = count;
            self.data = ds;

            self.tableParams.settings({
                total: count,
                dataset: angular.copy(ds)
            });

            self.reload();
            if (self._controller.hideloading) self._controller.hideloading();

        }, 100);
    }

   
    //========================================
    //table params
    self.tableParams = new NgTableParams({
        //count , page , sorting, filter 
        count: 10,
        page: 1
    }, {
        total: self.totalData,
        counts: [10, 20, 50],
        // determines the pager buttons (left set of buttons in demo)
        paginationMaxBlocks: 13,
        paginationMinBlocks: 2,

        /////////////////////////
        dataset: angular.copy(self.data) //static data
       
    });

    //========================================
    //loadData
    self.loadData();
    //========================================
    self.add = add;
    self.edit = edit;
    self.save = save;
    self.del = del;
    self.del_new = del_new;
    self.cancel = cancel;
    self.hasChanges = hasChanges;
    self.cancelChanges = cancelChanges;
    self.saveChanges = saveChanges;
    //////////
    self.search = function (filterobj) {
        self.tableParams.filter(filterobj);
    }


    function resetTableStatus() {
        self.isEditing = false;
        self.isAdding = false;
        self.deleteCount = 0;
        self._tableTracker.reset();
        self._tableForm.$setPristine();

    }
    ///////////////////////////////////////////////////////
    function hasChanges() {
        return self._tableForm.$dirty;
    }

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

    function saveChanges() {
        var curdata = self.tableParams.settings().dataset;
        var listdirty = [];
        $.each(curdata, function (key, value) {
            if (value.isDirty) {
                listdirty.push(value);
            }
        });
        var ok = self._controller.SaveListObject(listdirty);

        //==================
        if(ok){
            resetTableStatus();
            var currentPage = self.tableParams.page();
            self.data = angular.copy(curdata);
        }
        return ok;
    }
    ///////////////////////////////////////////////////////
    function add() {
        self.isAdding = true;
        var newRow = self._controller.NewObject();
        newRow.isAdding = true;
        newRow.isEditing = true;

        self.tableParams.settings().dataset.unshift(newRow);

        self.reload();
    }

    function edit(row, rowForm) {
        self._controller.Edit(row, rowForm);//edit on form
    }

    function save(row, rowForm) {
        var result = self._controller.SaveObject(row);

        //nếu là thêm mới thì reload lại
        if (result && (row.Id == undefined || row.Id == 0 || row.Id == '')) {
            row.Id = result;
            self._controller.ReloadTable();
            return;
        }

        if (result) {
            var originalRow = resetRow(row, rowForm);
            angular.extend(originalRow, row);
        }


    }

    function cancel(row, rowForm) {
        var originalRow = resetRow(row, rowForm);

        //-------------------------------
        if (originalRow != undefined)
            angular.extend(row, originalRow); //load old data
        else
            self.del_new(row); //delete the new row
    }

    function del(row) {
        self._controller.DeleteObject(row);
    }

    //delete the new row
    function del_new(row) {
        _.remove(self.tableParams.settings().dataset, function (item) {
            return row === item;
        });
        self.deleteCount++;
        self._tableTracker.untrack(row);
        self.tableParams.reload().then(function (data) {
            if (data.length === 0 && self.tableParams.total() > 0) {
                self.tableParams.page(self.tableParams.page() - 1);
                self.tableParams.reload();
            }
        });
    }

    //==============================================================
    function resetRow(row, rowForm) {
        row.isEditing = false;
        rowForm.$setPristine();
        self._tableTracker.untrack(row);
        if (row.Id == undefined) return undefined;

        //return row
        return _.find(self.data, { 'Id': row.Id });
    }

    self.reload = function () {
        // we need to ensure the user sees the new row we've just added.
        // it seems a poor but reliable choice to remove sorting and move them to the first page
        // where we know that our new item was added to
        self.tableParams.sorting({});
        self.tableParams.page(1);
        self.tableParams.reload();
    }

    //set value of NAME to dropdown 
    self.SetValue = function (ddid, row) {
        var items = $scope["dropdown_" + ddid];
        var objs = $.grep(items, function (e) { return e.Id == row[ddid]; });
        row[ddid + '_Name'] = "";
        if (objs.length > 0) {
            var obj = objs[0];
            row[ddid + '_Name'] = obj.Name;
        }
    }

}