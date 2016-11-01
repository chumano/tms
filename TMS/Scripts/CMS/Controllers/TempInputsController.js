CHUNOApp.controller('TempInputsController', ['$scope', '$filter', '$controller',
    function ($scope, $filter, $controller) {
        this.giatri = 2300.32;
        //append function to this $scope
        $controller('CommonController', { $scope: $scope });

        
    }
]);