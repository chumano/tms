CHUNOApp.controller('LayoutController',
['$rootScope', '$scope', '$filter', '$controller', '$interpolate', '$translate', 'localStorageService',
    function ($rootScope, $scope, $filter, $controller, $interpolate, $translate, localStorageService) {
        //get layout 
        var layout = localStorageService.get("layout");
        layout = layout || "expand";

        
        //track pushMenu
        $("body").on("expanded.pushMenu", function () {
            localStorageService.set("layout", "expand");
        });
        $("body").on("collapsed.pushMenu", function () {
            localStorageService.set("layout", "collapse");
        });

        //keep old layout
        $(document).ready(function () {
            setTimeout(function () {
                if (layout == "expand") {
                    $("body").removeClass('sidebar-collapse');
                    //$.AdminLTE.pushMenu.expand();
                } else {
                    $("body").addClass('sidebar-collapse');
                    //$.AdminLTE.pushMenu.collapse();
                }
            }, 100);
        });
    }
]);