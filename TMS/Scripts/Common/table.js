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
        if (ok) {
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


/////////////////////////////////////////////////////////////////////
function FixedDataTableForm(NgTableParams, $q, ctrl, $scope, fixeddata) {
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
    self.totalData = fixeddata.length;
    self.data = fixeddata;

    //========================================
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

    self.SetData = function (newdata) {
        self.data = newdata;
        self.tableParams.settings({
            dataset: angular.copy(newdata)
        });
    }
    //========================================
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
        if (ok) {
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

    //==============================================================
    //init table
    self.reload();
}
