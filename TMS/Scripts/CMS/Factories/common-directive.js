CHUNOApp.directive('alias', function () {
    return {
        restrict: 'A',
        link: function (scope, element, attrs) {
            var splits = attrs['alias'].trim().split(/\s+as\s+/);
            scope.$watch(splits[0], function (val) {
                scope.$eval(splits[1] + '=(' + splits[0] + ')');
            });
        }
    };
});