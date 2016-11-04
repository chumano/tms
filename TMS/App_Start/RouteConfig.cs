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
            //route for testview
            routes.MapRoute(
                name: "TestView",
                url: "Tool/TView/{viewname}/{objectid}",
                defaults: new { controller = "Tool", action = "TView", objectid = UrlParameter.Optional }
            );

            routes.MapRoute(
                name: "CMSDefault",
                url: "{controller}/{action}/{id}",
                defaults: new { controller = "CMS", action = "Index", id = UrlParameter.Optional }
            );
            
            //==============================================================


            routes.MapRoute(
                name: "Default",
                url: "{*url}",
                defaults: new { controller = "Home", action = "Index" }
            );

           

        }
        
      
    }
}
