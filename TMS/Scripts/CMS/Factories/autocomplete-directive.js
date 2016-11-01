
    CHUNOApp.directive('myAutocomplete', function () {
        var directive = {};
        directive.restrict = 'A';
        directive.compile = function (element, attributes) {
            var autocompleteId = element.attr("autocomplete-id");
            //element.attr("autocomplete-id", autocompleteId);
            element.after('<span ng-init="initAutoComplete(\'' + autocompleteId + '\');"></span>');

        }
        return directive;
    });

