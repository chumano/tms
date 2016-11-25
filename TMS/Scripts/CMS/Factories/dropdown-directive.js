CHUNOApp.directive('myDropdown', function ($parse, $interpolate) {
    var directive = {
        require: 'ngModel'
    };
   
    directive.restrict = 'A';

    directive.link = function (scope, element, attrs, ngModel) {
        ngModel.$parsers.push(function(val) {
            return parseInt(val, 10); //set value to ng-model
        });
        ngModel.$formatters.push(function(val) {
            return '' + val; //get value from ng-model
        });
    }

    directive.compile = function (element, attributes) {
        
        var dropdownId = element.attr("dropdown-id");
        element.attr("dropdown-id", dropdownId); 
        element.after('<span ng-init="InitVisibleDropdown(\'' + dropdownId + '\');"></span>');

        var valueField = element.attr("dropdown-column-value");
        var nameField = element.attr("dropdown-column-name");

        var emptyText = element.attr("dropdown-empty-text");
        var emptyValue = element.attr("dropdown-empty-value");

       

        element.empty();

        if (emptyText) {
            if (emptyValue == undefined) {
                emptyValue = 0;
            }
            element.append(' <option value="' + emptyValue + '"> ' + emptyText + '</option>');
        }

        element.append(' <option ng-repeat="item in dropdown_' + dropdownId + '" value="{{item.' + valueField + '}}" ng-bind="item.' + nameField + '"></option>');
        //element.append(' <option ng-repeat="item in dropdown_' + dropdownId + '" value="{{item}}" ng-bind="item.' + nameField + '"></option>');

        return this.link;
    }
    return directive;
});

CHUNOApp.directive('objectDropdown', function () {
    var directive = {
        require: 'ngModel'
    };

    directive.restrict = 'A';
    directive.link = function (scope, element, attrs, ngModel) {
        var valueField = element.attr("dropdown-column-value");
        var nameField = element.attr("dropdown-column-name");


        ngModel.$parsers.push(function (val) {
            return $.parseJSON(val); //set value to ng-model
        });
        ngModel.$formatters.push(function (val) {
            var obj = {};
            obj[valueField] = val[valueField];
            obj[nameField] = val[nameField];
            return obj; //get value from ng-model
        });
    }

    directive.compile = function (element, attributes) {

        var dropdownId = element.attr("dropdown-id");
        element.attr("dropdown-id", dropdownId);
        element.after('<span ng-init="InitVisibleDropdown(\'' + dropdownId + '\');"></span>');

        var valueField = element.attr("dropdown-column-value");
        var nameField = element.attr("dropdown-column-name");

        var emptyText = element.attr("dropdown-empty-text");
        var emptyValue = element.attr("dropdown-empty-value");

        var dropdownObject = element.attr("dropdown-object");

        element.empty();

        if (emptyText) {
            if (emptyValue == undefined) {
                emptyValue = 0;
            }
            element.append(' <option value="' + emptyValue + '"> ' + emptyText + '</option>');
        }

        //element.attr("ng-options", 'item as item.' + nameField + ' for item in dropdown_' + dropdownId + '');
        //element.append(' <option ng-repeat="item in dropdown_' + dropdownId + '" value=\'{"' + valueField + '\" : {{item.' + valueField + '}}, \"' + nameField + '\" : \"{{item.' + nameField + '}}\" }\''
        //    + 'ng-bind="item.' + nameField + '"  ng-selected="{{' + dropdownObject + '.' + valueField + ' == item.' + valueField + '}}"></option>');
        //element.append(' <option ng-repeat="item in dropdown_' + dropdownId + '" value="{{item}}" ng-bind="item.' + nameField + '"></option>');

        return this.link;
    }
    return directive;
});




CHUNOApp.directive('yesNoDropdown', function ($parse, $interpolate) {
    var directive = {
        require: 'ngModel'
    };

    directive.restrict = 'A';

    directive.link = function (scope, element, attrs, ngModel) {
        ngModel.$parsers.push(function (val) {
            if (val == '') return '';
            return val==='true'; //set value to ng-model
        });
        ngModel.$formatters.push(function (val) {
            return '' + val; //get value from ng-model
        });
    }

    directive.compile = function (element, attributes) {
        element.empty();
        element.append(' <option value="' + ''  + '"> ' + '' + '</option>');

        element.append(' <option value="false">No</option>');
        element.append(' <option value="true">Yes</option>');

        return this.link;
    }
    return directive;
});