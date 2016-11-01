CHUNOApp.controller('MenuController',
['$scope', '$filter', '$controller', '$interpolate',
    function ($scope, $filter, $controller, $interpolate) {
        
        $scope.CurrentUrl = window.location.pathname.toLowerCase();

        $scope.ListMenu = [
            {
                id: "tool", url: "#", name: "TOOL", cssclass: "fa fa-suitcase",
                childs: [
                    { id: "t_dbtable", url: "/Tool/DBTable", name: "Tạo view", cssclass: "fa fa-th" },
                    { id: "t_temp_inputs", url: "/Tool/TempInputs", name: "Mẫu - inputs", cssclass: "fa fa-th" },
                    { id: "t_temp_tables", url: "/Tool/TempTables", name: "Mẫu - bảng", cssclass: "fa fa-table" },
                    { id: "t_temp_autocomplete", url: "/Tool/TempAutocomplete", name: "Mẫu - autocomplete", cssclass: "fa fa-edit" },
                    { id: "t_temp_testview", url: "/Tool/TestView", name: "Test View", cssclass: "fa fa-edit" }
                ]
            },
            {
                id: "cms", url: "#", name: "Quản lý", cssclass: "fa fa-book",
                childs: [
                    { id: "c_provinces", url: "/cms/provinces", name: "Tỉnh/TP", cssclass: "fa fa-bars" },
                    { id: "c_districts", url: "/cms/districts", name: "Quận/Huyện", cssclass: "fa fa-bars" },
                    { id: "c_departments", url: "/cms/departments", name: "Phòng ban", cssclass: "fa fa-bars" },
                    { id: "c_files", url: "/cms/files", name: "Files", cssclass: "fa fa-bars" },
                    { id: "c_images", url: "/cms/images", name: "Images", cssclass: "fa fa-bars" },
                ]
            },
            {
                id: "role", url: "#", name: "Phân quyền", cssclass: "fa fa-users",
                childs: [
                    { id: "r_users", url: "/cms/users", name: "Người dùng", cssclass: "fa fa-user" },
                    { id: "r_accounts", url: "/cms/accounts", name: "Tài khoản", cssclass: "fa  fa-heart" },
                    { id: "r_roles", url: "/cms/roles", name: "Quyền", cssclass: "fa fa-star" }
                ]
            }
        ];

        $scope.IsParrentCurrent = function (menu) {
            var isparrent = false;
            if ($scope.HasChilds(menu)) {
                for(var i = 0;  i< menu.childs.length;i++) 
                {
                    var cmenu = menu.childs[i];
                    if ($scope.CurrentUrl == cmenu.url.toLowerCase()) {
                        isparrent = true;
                    }

                    if (!isparrent) {
                        isparrent = $scope.IsParrentCurrent(cmenu);
                    }

                    if (isparrent)
                        break;
                }
            }
            return isparrent;
        }

        $scope.HasChilds = function (menu) {
            if (menu.childs != undefined && menu.childs.length > 0)
                return true;
            else;
        }
    }]);