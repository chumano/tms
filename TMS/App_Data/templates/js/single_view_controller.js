CHUNOApp.controller('ToolDBTableController', ['$scope', 'NgTableParams', '$controller', '$q', '$timeout',
    function ($scope, NgTableParams, $controller, $q, $timeout) {
        $controller('CommonController', { $scope: $scope });
        var self = this;
        //========================================================
        //Controller Properties
        self.isSearching = false;
        $scope.Message = self.Message = "My name is <span><b>Mudassar Khan</b></span>";
        self.IsShowDetail = false;

        //search 
        self.IsActiveS = "1";//YES
        //======================================
        //form config
        self.FormConfig = new DataObject("T_Tool_DBTable", $scope);
        self.FormConfig._CanCreate = true;
        self.FormConfig._CanUpdate = true;
        self.FormConfig._CanDelete = true;
        $scope.ChildObject = {};
        $scope.ChildObject.FormConfig = self.FormConfig;
        //======================================
        //tableform
        self.TableForm = new TableForm(self, NgTableParams);
        
        
        //======================================
        self.AddItem = function () {
            self.TableForm.add();
        };
        self.GenerateDBTable = function () {
            ShowConfirmModal("Tạo DBTable từ Cơ sở dữ liệu!", function () {
                var result = AjaxSync(_tool_service_generatedbtable, {});
                if (result) {
                    ShowSuccessMessage("Đã tạo xong");
                    self.TableForm.LoadData();
                }
            });
        }

        self.ShowDetail = function (item) {
            //$scope.ResetProductForm();
            var object = self.FormConfig.GetObject(item.Id); //GetObject(value, colname)

            var copyobject = {};
            //self.FormConfig.CopyFields(object, copyobject); //copyobject có thuộc tính nào thì object mới đưa vào
            $.extend(copyobject, object);
            

            copyobject._CanUpdate = self.FormConfig._CanUpdate;//item._CanUpdate;
            copyobject._CanDelete = self.FormConfig._CanDelete;
            $scope.ChildObject.set(copyobject);
            //========================
            self.IsShowDetail = true;
            self.IsEditingDetail = false;
            
        }

        self.CloseDetail = function () {
            if (self.IsEditingDetail ) {
                self.IsEditingDetail = false; //tử trạng thái đang chỉnh sửa -> only view
            }
            else {
                self.IsShowDetail = false; //
            }
        }

        self.EditDetail = function () {
            self.IsEditingDetail = true;
        }
        self.SaveForm = function () {
            $scope.CustomerFormConfig.SetObject($scope.CustomerForm);
            var customerId = $scope.CustomerFormConfig.SaveObject();
            if (customerId > 0) {
                $scope.CustomerForm.CustomerId = customerId;
                $("button[data-dismiss='modal']:visible").click();

                if ($scope.CustomerForm.IsWholeSale == 0) {
                    $scope.ReloadGrid('Customers');
                    ShowSuccessMessage("Khách hàng được tạo thành công!");
                }
                else {
                    $scope.ReloadGrid('SaleCustomers');
                    ShowSuccessMessage("Khách hàng sỉ được tạo thành công!");
                }

                $scope.ExposeFunctionAfterSavingCustomer();
            }

        }

        $scope.DeleteObject = function (customer, isSale) {
            if (confirm("Bạn có muốn xóa khách hàng " + customer.CustomerCode + " - " + customer.CustomerName + "?")) {
                if ($scope.CustomerFormConfig.DeleteObject(customer.CustomerId)) {
                    if (isSale == 0) {
                        $scope.ReloadGrid('Customers');
                        ShowSuccessMessage("Khách hàng được xóa thành công!");
                    }
                    else {
                        $scope.ReloadGrid('SaleCustomers');
                        ShowSuccessMessage("Khách hàng sỉ được xóa thành công!");
                    }
                }
            }
        }

        //======================================
        self.Search = function () {
            self.TableForm.search(self.searchTerm, self.IsActiveS);
        };
        self.showloading = showloading;
        self.hideloading = hideloading;
        //======================================
        

        function showloading() {
            self.isSearching = true;
            //$('#btn-search').redraw();
            return;
            $('#btn-search i.fa').hide().after('<i class="fa fa-refresh white loading"></i>');
        }

        function hideloading() {
            self.isSearching = false;
            //$('#btn-search').redraw();
            return;
            
            var loading = $('#btn-search i.fa.loading');
            loading.prev().show();
            loading.remove();
        }

        //=======================================
        //init - data
        self.TableForm.LoadData();
    }]
);

function TableForm(ctrl, NgTableParams) {
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
        page : 1
    }, {
        total: self.totalData,
        counts :[10,20,50,100],
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
    self.search = function (term, isActiveS) {
        //var term = self._controller.searchTerm;
        //var isActiveS = self._controller.IsActiveS;
        if (term == undefined && isActiveS == undefined) return;
        //===================================
        var filterobj = {};
        if (term) {
            filterobj = { TableName: term };
        }
        if (isActiveS != "" && isActiveS != undefined) {
            $.extend(filterobj, { IsActive: (isActiveS == "1" ? true : false) });
        }
        self.tableParams.filter(filterobj);
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
            Version : 1,
            isEditing : true
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
        ShowConfirmModal("Bạn có muốn xóa \"" + row.TableName + "\" không?", function () {
            //------------xóa------------------
            var FormConfig = self._controller.FormConfig;
            //FormConfig.SetObject(row);
            var result = FormConfig.DeleteObject(row.Id);
            if (result) {
                self.LoadData(); 
            }
            /*
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
            });*/
        });
    }

    function save(row, rowForm) {
        var FormConfig = self._controller.FormConfig;
        FormConfig.SetObject(row);

        var result = FormConfig.SaveObject(); //result is Id

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
        return _.find(self.data, { 'Id': row.Id});
    }

    function changeFilter(field, value) {
        var filter = {};
        filter[field] = value;
        angular.extend(self.tableParams.filter(), filter);
    }
    //===================================================
    self.LoadData = function() {
        self._controller.showloading();
        //===========================       
        var dataService = new DataService({});
        var config =new DataFormConfig();
        config.dataobject = 'T_TOOL_DBTable';
        config.columns = //['[Id]', '[TableName]', '[TableTitle]','[IsActive]','[Version]'].join(';'); //ok
                    ['Id', 'TableName', 'TableTitle', '[IsActive]'].join(';'); //ko dc
                    //"Id;TableName;TableTitle;IsActive;Version"; //ko dc
        config.sort = 'Id DESC';
        config.condition = '';// '(IsActive=1 or IsActive is NULL)';

        config.action = 'getall'; //getall/get
        config.startrow = 0;
        config.endrow = 10;
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

            self._controller.hideloading();

            self._controller.Search();
        },  100);
    };

       
}