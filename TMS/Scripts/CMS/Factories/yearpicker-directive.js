
    CHUNOApp.directive('yearPicker', function () {
        var directive = {};
        directive.restrict = 'A';
        directive.compile = function (element, attributes) {
            var pickerid = element.attr("year-picker-id");
            element.after('<span ng-init="initYearPicker(\'' + pickerid + '\');"></span>');

            //restrict number-only
            var ele = element[0];
            var regex = RegExp("^[0-9]*$");
            var value = ele.value;

            ele.addEventListener('keyup', function (e) {
                if (regex.test(ele.value)) {
                    value = ele.value;
                } else {
                    ele.value = value;
                }
            });

        };
        
        return directive;
    });

