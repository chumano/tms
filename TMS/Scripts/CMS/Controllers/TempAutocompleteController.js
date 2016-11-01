CHUNOApp.controller('TempAutocompleteController', ['$scope', '$filter', '$controller',
    function ($scope, $filter, $controller) {
        this.giatri = 4;
        //append function to this $scope
        $controller('CommonController', { $scope: $scope });
        
    }
]);