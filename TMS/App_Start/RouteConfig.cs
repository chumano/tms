using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using System.Web.Routing;

namespace TMS
{
    public class RouteConfig
    {
        public static void RegisterRoutes(RouteCollection routes)
        {
            routes.IgnoreRoute("{resource}.axd/{*pathInfo}");
            
            //===============================================
            //testRoute(routes);

            //==============================================================
            //cms
            //cmsRoute(routes);
            routes.MapRoute(
                name: "TestView",
                url: "Tool/TView/{viewname}/{objectid}",
                defaults: new { controller = "Tool", action = "TView", objectid = UrlParameter.Optional }
            );

            routes.MapRoute(
                name: "CMSDefault",
                url: "{controller}/{action}/{id}",
                defaults: new { controller = "Tool", action = "Index", id = UrlParameter.Optional }
            );
            
            //==============================================================


            routes.MapRoute(
                name: "Default",
                url: "{*url}",
                defaults: new { controller = "Home", action = "Index" }
            );

           

        }
        private static void testRoute(RouteCollection routes)
        {
            routes.MapRoute(
              name: "chuno",
              url: "routesDemo/chuno",
              defaults: new { controller = "RoutesDemo", action = "Chuno" });

            routes.MapRoute(
                name: "routeOne",
                url: "routesDemo/One",
                defaults: new { controller = "RoutesDemo", action = "One" });

            routes.MapRoute(
                name: "routeTwo",
                url: "routesDemo/Two/{donuts}",
                defaults: new { controller = "RoutesDemo", action = "Two", donuts = UrlParameter.Optional });

            routes.MapRoute(
                name: "routeThree",
                url: "routesDemo/Three",
                defaults: new { controller = "RoutesDemo", action = "Three" });

            routes.MapRoute(
                name: "login",
                url: "Account/Login",
                defaults: new { controller = "Account", action = "Login" });

            routes.MapRoute(
                name: "register",
                url: "Account/Register",
                defaults: new { controller = "Account", action = "Register" });

            routes.MapRoute(
                name: "routeFour",
                url: "routesDemo/Four",
                defaults: new { controller = "RoutesDemo", action = "Four" });

        }
        private static void cmsRoute(RouteCollection routes){
            //==============================================================
            //tool
            routes.MapRoute(
               name: "cms_tool_tables",
               url: "cms/tool/tables",
               defaults: new { controller = "Tool", action = "Tables" });

            routes.MapRoute(
              name: "cms_tool_config",
              url: "cms/tool/config",
              defaults: new { controller = "Tool", action = "Config" });

            routes.MapRoute(
               name: "cms_tool_createview",
               url: "cms/tool/createview",
               defaults: new { controller = "Tool", action = "CreateView" });

            
            //==============================================================
            //cms
            routes.MapRoute(
              name: "cms_users",
              url: "cms/users",
              defaults: new { controller = "CMS", action = "Users" });

            routes.MapRoute(
              name: "cms_roles",
              url: "cms/roles",
              defaults: new { controller = "CMS", action = "Authors" });


            //default cms
            routes.MapRoute(
               name: "cms_default",
               url: "cms/{*url}",

               defaults: new { controller = "Tool", action = "Index" });
        }
    }
}
