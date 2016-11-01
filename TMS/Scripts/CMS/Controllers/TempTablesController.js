CHUNOApp.controller('TempTablesController', ['$scope', 'NgTableParams', '$q', '$timeout',
    function ($scope, NgTableParams ,$q,$timeout) {
        var self = this;
        self.isSearching = false;
        self.Message = "My name is <span><b>Mudassar Khan</b></span>";
        self.cols = [{
            field: "name",
            title: "Name",
            filter: {
                name: "text"
            },
            sortable: "name",
            dataType: "text"
        }, {
            field: "age",
            title: "Age",
            filter: {
                age: "number"
            },
            sortable: "age",
            dataType: "number"
        }];

        self.originalData = [];
        $scope.loaddata = function ( params) {
            showloading();
            var filter = params.filter();
            var sorting = params.sorting();
            var pagesize = params.count();
            var page = params.page();
            //===========================
            var conditionarr = [];
            for (var key in filter) {

                conditionarr.push(key + " like N\'%" + filter[key] + "%\'");
            }

            var sortnarr = [];
            for (var key in sorting) {

                sortnarr.push(key + " " + sorting[key] + "");
            }
            //===========================
            var dataService = new DataService({});
            dataService.config = {};
            dataService.config.dataobject = 't_tool_table';
            dataService.config.columns = ['id', 'name', 'age'].join(';');

            dataService.config.sort = sortnarr.join(",");
            dataService.config.condition = conditionarr.join(" AND ");

            dataService.config.numdata = pagesize;
            dataService.config.startrow = (page - 1) * pagesize + 1;
            dataService.config.endrow = (page) * pagesize;

            self.tableParams.total(dataService.CountListData());

            var deferred = $q.defer();
            setTimeout(function () {
                //dataService.GetListDataAsync(function (ds) {
                //    hideloading();
                //    deferred.resolve(ds);
                //});
                var ds = dataService.GetListData();
                hideloading();
                deferred.resolve(ds);
            }, 100);

            //===========================================
            var dataset = deferred.promise;
            self.originalData = angular.copy(dataset);
            

            //$defer.resolve(dataset);
            return dataset;
        };
        //=================================================

        self.tableParams = new NgTableParams({
            //count , page , sorting, filter 
            count: 5, // initial page size
            page :1 
        }, {
            total: 20,
            // page size buttons (right set of buttons in demo)
            counts: [5, 10, 20, 50],

            // determines the pager buttons (left set of buttons in demo)
            paginationMaxBlocks: 13,
            paginationMinBlocks: 2,


            /////////////////////////
            //dataset :  angular.copy(dataset_demo)
            
            //dynamic
            getData: $scope.loaddata
        });

        self.cancel = cancel;
        self.save = save;
        self.edit = edit;
        self.del = del;

        self.add = add;
        self.cancelChanges = cancelChanges;     
        self.hasChanges = hasChanges;
        self.saveChanges = saveChanges;

        //////////

        
        function cancelChanges() {
            resetTableStatus();
            var currentPage = self.tableParams.page();
            self.tableParams.settings({
                dataset: angular.copy(self.originalData)
            });
            // keep the user on the current page when we can
            if (!self.isAdding) {
                self.tableParams.page(currentPage);
            }
        }

        function hasChanges() {
            return self.tableForm.$dirty || self.deleteCount > 0
        }

        function resetTableStatus() {
            self.isEditing = false;
            self.isAdding = false;
            self.deleteCount = 0;
            self.tableTracker.reset();
            self.tableForm.$setPristine();

          
        }

        function saveChanges() {
            resetTableStatus();
            var currentPage = self.tableParams.page();
            self.originalData = angular.copy(self.tableParams.settings().dataset);
        }
        function add() {
            //self.isEditing = true;
            self.isAdding = true;
            var newRow = {
                name: "",
                age: null,
                money: null,
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
            if (originalRow != undefined)
                angular.extend(row, originalRow);
            else
                del(row);
        }

        function edit(row, rowForm) {
            row.isEditing = true;
        }
        
        function del(row) {
            _.remove(self.tableParams.settings().dataset, function (item) {
                return row === item;
            });
            self.deleteCount++;
            self.tableTracker.untrack(row);
            self.tableParams.reload().then(function (data) {
                if (data.length === 0 && self.tableParams.total() > 0) {
                    self.tableParams.page(self.tableParams.page() - 1);
                    self.tableParams.reload();
                }
            });
        }

        function save(row, rowForm) {
            var originalRow = resetRow(row, rowForm);
            angular.extend(originalRow, row);
        }

        function resetRow(row, rowForm) {
            row.isEditing = false;
            rowForm.$setPristine();
            self.tableTracker.untrack(row);
            //return _.findWhere(originalData, function (r) {
            //    return r.id === row.id;
            //});
            return _.findWhere(self.originalData, { 'id': row.id});
        }

       
        //======================================
        self.changeFilter = changeFilter;
        self.applyGlobalSearch = applyGlobalSearch;

        function applyGlobalSearch() {
            var term = self.globalSearchTerm;

            self.tableParams.filter({ name : term });
        }

        function changeFilter(field, value) {
            var filter = {};
            filter[field] = value;
            angular.extend(self.tableParams.filter(), filter);
        }

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
    }]
);

var dataset_demo = [
    { id: 1 ,name: 'christian', age: 1 },
    { id: 2, name: 'anthony', age: 2 },
    { id: 3, name: 'christian', age: 3 },
    { id: 4, name: 'anthony', age: 4 },
    { id: 5, name: 'christian', age: 5 },
    { id: 6, name: 'anthony', age: 6 },
    { id: 7, name: 'christian', age: 7 },
    { id: 8, name: 'anthony', age: 8 },
    { id: 9, name: 'christian', age: 9 },
    { id: 10, name: 'anthony', age: 88 },
    { id: 11, name: 'christian', age: 21 },
    { id: 12, name: 'anthony', age: 11 }
];