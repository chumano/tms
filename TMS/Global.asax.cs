﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using System.Web.Optimization;
using System.Web.Routing;
using System.Reflection;
using Template;
using Common;
namespace TMS
{
    public class MvcApplication : System.Web.HttpApplication
    {
        protected void Application_Start()
        {
            var assembly = typeof(Template.iTemplate).Assembly;
            string []p =assembly.GetManifestResourceNames();

            string content = FileHelper.ReadEmbeddedFile(assembly,p[0]);

            Common.DBHelper.ConnectionString = System.Configuration.ConfigurationManager.ConnectionStrings["TMSConnectionString"].ConnectionString;
            AreaRegistration.RegisterAllAreas();
            FilterConfig.RegisterGlobalFilters(GlobalFilters.Filters);
            RouteConfig.RegisterRoutes(RouteTable.Routes);
            BundleConfig.RegisterBundles(BundleTable.Bundles);

            IoCConfig.RegisterDependencies();
        }
    }
}
