using System.Web.Optimization;

namespace TMS
{
    public class BundleConfig
    {
        public static void RegisterBundles(BundleCollection bundles)
        {
            //=======================================
            //=======================================
            //common
            commonBundles(bundles);

            //--------------------------------------------
            //---app
            bundles.Add(new ScriptBundle("~/bundles/AwesomeAngularMVCApp")
                .IncludeDirectory("~/Scripts/Factories", "*.js")
                .IncludeDirectory("~/Scripts/Controllers", "*.js")
                
                .Include("~/Scripts/AwesomeAngularMVCApp.js")
                );

          
            //--------------------------------------------
            //cms
            CMSBundles(bundles);

            BundleTable.EnableOptimizations = false;
        }

        public static void commonBundles(BundleCollection bundles)
        {
            bundles.Add(new ScriptBundle("~/libs/jquery")
               .Include("~/Scripts/libs/jquery/jquery-2.1.4.min.js")
               .Include("~/Scripts/libs/jquery/jquery-ui.js")
               );

            bundles.Add(new ScriptBundle("~/libs/bootstrap")
              .Include("~/Scripts/libs/bootstrap/js/bootstrap.min.js")
              .Include("~/Scripts/libs/notify/notify.min.js")
              );

            bundles.Add(new ScriptBundle("~/libs/angularjs")
                .Include("~/Scripts/libs/angular-1.5.7/angular.min.js")
                .Include("~/Scripts/libs/angular-1.5.7/angular-ui-router.min.js")
                .Include("~/Scripts/libs/ui-bootstrap-tpls-1.3.3.min.js")
                .Include("~/Scripts/libs/ng-table/ng-table.js")
                .Include("~/Scripts/libs/angular-1.5.7/angular-sanitize.min.js")
                );


            bundles.Add(new ScriptBundle("~/common/js")
                  .Include("~/Scripts/libs/InputMask.js") //inputmask jquery
                  .Include("~/Scripts/libs/lodash.min.js") //<!-- lodasd utils : _ variable -->
                  .Include("~/Scripts/libs/loadimage/load-image.all.min.js")
                  .IncludeDirectory("~/Scripts/Common", "*.js")
                 );


            //styles
            bundles.Add(new StyleBundle("~/Content/css")
                .Include("~/Content/jquery-ui.css")
                .Include("~/Scripts/libs/bootstrap/css/bootstrap.css")
                .Include("~/Content/font-awesome-4.6.2/css/font-awesome.min.css")
                .Include("~/Content/ionicons-2.0.1/css/ionicons.min.css")
                .Include("~/Scripts/libs/ng-table/ng-table.css")

                .Include("~/Content/autocomplete.css")
                .Include("~/Content/Site.css")
                .Include("~/Content/FValidation.css")
                );
        }

        public static void CMSBundles(BundleCollection bundles)
        {
           
            bundles.Add(new ScriptBundle("~/adminlte/js")
                .Include("~/Scripts/libs/adminlte/dist/js/app.js")
                );

            bundles.Add(new ScriptBundle("~/bundles/CHUNOApp")
                .Include("~/Scripts/CMS/CHUNOApp.js")
                .IncludeDirectory("~/Scripts/CMS/Common", "*.js")
                .IncludeDirectory("~/Scripts/CMS/Factories", "*.js")
                );

            //================================================================
            bundles.Add(new ScriptBundle("~/bundles/cms/ToolDBTable")
               .Include("~/Scripts/CMS/Controllers/ToolDBTableController.js")
               .Include("~/Scripts/CMS/Controllers/ToolDBTableConfigController.js")
               );


            bundles.Add(new ScriptBundle("~/bundles/cms/TempTables")
               .Include("~/Scripts/CMS/Controllers/TempTablesController.js"));

            bundles.Add(new ScriptBundle("~/bundles/cms/TempInputs")
               .Include("~/Scripts/CMS/Controllers/TempInputsController.js"));

            bundles.Add(new ScriptBundle("~/bundles/cms/TempAutocomplete")
               .Include("~/Scripts/CMS/Controllers/TempAutocompleteController.js"));
            //----------------------------------------------------------------
            //cms
            bundles.Add(new StyleBundle("~/adminlte/css")
                .Include("~/Scripts/libs/adminlte/dist/css/skins/skin-blue.css")
                .Include("~/Scripts/libs/adminlte/dist/css/AdminLTE.css")
                );
        }
    }
}