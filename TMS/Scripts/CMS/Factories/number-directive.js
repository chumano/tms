CHUNOApp.directive('convertToNumber', function () {
    var directive = {
        require: 'ngModel'
    };

    directive.restrict = 'A';
    directive.link = function (scope, element, attrs, ngModel) {
        var ele = element;
        ngModel.$parsers.push(function (val) {
            var value = parseInt(val, 10);
            if (value) {
            } else value = 0;

            $(ele).val(value);

            return value;//set value to ng-model
        });
        ngModel.$formatters.push(function (val) {
            return '' + val; //get value from ng-model
        });
    }

    return directive;
});