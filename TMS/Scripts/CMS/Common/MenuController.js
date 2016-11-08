CHUNOApp.controller('MenuController',
['$scope', '$filter', '$controller', '$interpolate','$translate', 'localStorageService',
    function ($scope, $filter, $controller, $interpolate, $translate, localStorageService) {
        //==============================
        //session variable
        $scope.CurrentUser = _session_userid;
        $scope.CurrentUserName = _session_username;
        //==============================
        //menu
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

        function findAddChild(condition, array) {
            var returnList = [];
            array.forEach(function(item, index) {
                if (item.Parent==condition) {
                    returnList.push({
                        id: '',
                        url: item.Url,
                        name: item.Menu,
                        cssclass: item.CssClass,
                        childs: findAddChild(item.MenuId, array)
                    });
                }
            });
            return returnList;
        }

        function LoadMenu(){
            var dataService = new DataService({});
            dataService.config = {};
            dataService.config.dataobject = "dbo.UFN_System_Get_Menu";
            dataService.config.type = "function";
            dataService.config.functionparameters = $scope.CurrentUser;
            dataService.config.action = "getall";
            dataService.config.sort = "MenuLevel,DisplayOrder";
            {
                //dataService.EvaluateFieldExpression($interpolate, $scope);
                var list = dataService.GetListData();
                return findAddChild('', list);
            }
        }

        //load menu
        if ($scope.CurrentUser > 0) {
            $scope.ListMenu = LoadMenu();
        }

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

        //==============================
        //language
        $scope.currentLanguage = 'en';
        var cookieLanguage = $translate.storage().get('NG_TRANSLATE_LANG_KEY');
        if (cookieLanguage)
            $scope.currentLanguage = cookieLanguage;
        var cur = localStorageService.get("currentLanguage");
        //localStorageService.clearAll(/^\d+$/);
        //localStorageService.clearAll();

        $scope.changeLanguage = function (key) {
            if ($scope.currentLanguage != key)
                $translate.use(key);
            $scope.currentLanguage = key;

            localStorageService.set("currentLanguage", key);
        };

        //==============================
        //login - logout
        $scope.LogIn = function () {
            if (FValidation.CheckControls("")) {
                var result = AjaxSync(_account_login, '{ "username": "' + $scope.LoginInfo.Username + '", "password": "' + $scope.LoginInfo.Password + '"}');
                if (result) {
                    if (typeof (Storage) !== "undefined") {
                        // Store
                        if ($scope.LoginInfo.Remember) {
                            localStorage.setItem("TMS_Username", $scope.LoginInfo.Username);
                            localStorage.setItem("TMS_Password", $scope.LoginInfo.Password);
                            localStorage.setItem("TMS_Remember", $scope.LoginInfo.Remember);
                        }
                        else {
                            localStorage.setItem("TMS_Username", "");
                            localStorage.setItem("TMS_Password", "");
                            localStorage.setItem("TMS_Remember", $scope.LoginInfo.Remember);
                        }
                    }

                    location.reload();
                }
                else {
                    ShowErrorMessage("Tài khoản không hợp lệ.");
                }
            }
        }

        $scope.LogOut = function () {
            var result = AjaxSync(_account_logout, '{ }');
            if (result) {
                location.reload();
            }
        }

        $scope.LoginInfo =
        {
            Username: "",
            Password: "",
            Remember: false
        };

}]);
