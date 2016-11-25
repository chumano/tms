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
                .Include("~/Scripts/libs/angular-translate-2.9.0.1/angular-translate.js")
                .Include("~/Scripts/libs/angular-cookies-master/angular-cookies.min.js")
                .Include("~/Scripts/libs/angular-translate-storage-cookie-master/angular-translate-storage-cookie.js")
                .Include("~/Scripts/libs/angular-translate-storage-local-master/angular-translate-storage-local.js")
                .Include("~/Scripts/libs/angular-local-storage-master/dist/angular-local-storage.js")
                );


            bundles.Add(new ScriptBundle("~/common/js")
                  .Include("~/Scripts/libs/InputMask.js") //inputmask jquery
                  .Include("~/Scripts/libs/lodash.min.js") //<!-- lodasd utils : _ variable -->
                  .Include("~/Scripts/libs/loadimage/load-image.all.min.js")
                  .IncludeDirectory("~/Scripts/Common", "*.js")
                 );


            //styles
            bundles.Add(new StyleBundle("~/common/css")
                .Include("~/Content/jquery-ui.css")
                .Include("~/Scripts/libs/bootstrap/css/bootstrap.css")
                .Include("~/Content/font-awesome-4.6.2/css/font-awesome.min.css")
                .Include("~/Content/ionicons-2.0.1/css/ionicons.min.css")
                .Include("~/Scripts/libs/ng-table/ng-table.css")
                .Include("~/Scripts/libs/iCheck/square/blue.css") //iCheck box

                .Include("~/Content/autocomplete.css")
                
                .Include("~/Content/FValidation.css")
                );

            bundles.Add(new StyleBundle("~/Content/site")
               .Include("~/Content/Site.css")
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

           
            //----------------------------------------------------------------
            //cms
            bundles.Add(new StyleBundle("~/adminlte/css")
                .Include("~/Scripts/libs/adminlte/dist/css/skins/skin-blue.css")
                .Include("~/Scripts/libs/adminlte/dist/css/AdminLTE.css")
                );
        }
    }
}