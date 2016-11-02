CHUNOApp.controller('HeaderController',
['$scope', '$filter', '$controller', '$interpolate','$translate', 'localStorageService',
    function ($scope, $filter, $controller, $interpolate, $translate, localStorageService) {
        $scope.currentLanguage = 'en';
        var cookieLanguage = $translate.storage().get('NG_TRANSLATE_LANG_KEY');
        if (cookieLanguage)
            $scope.currentLanguage = cookieLanguage;
        var cur = localStorageService.get("currentLanguage");
        //localStorageService.clearAll(/^\d+$/);
        //localStorageService.clearAll();

        $scope.changeLanguage = function (key) {
            if ($scope.currentLanguage!=key)
                $translate.use(key);
            $scope.currentLanguage = key;

            localStorageService.set("currentLanguage", key);
        };
    }]);