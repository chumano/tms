﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using Service;

namespace TMS.Controllers
{
    public class BaseController : Controller
    {
        protected IDataService dataService;

        public BaseController(IDataService _dataService) 
        {
            dataService = _dataService;
        }

        public ActionResult CheckSession()
        {
            if (!SessionCollection.IsLogIn)
            {
                if (SessionCollection.IsLogOut)
                {
                    return RedirectToAction("Login", "Account");
                }
                else
                {
                    return RedirectToAction("Login", "Account", new { auto = true });
                }
            }
            else
            {
                //string actionName = this.ControllerContext.RouteData.Values["action"].ToString();
                //string controllerName = this.ControllerContext.RouteData.Values["controller"].ToString();
                //if (controllerName != "Account" && controllerName != "POS")
                //{
                //    var gridConfig = new GridViewConfig
                //    {
                //        GridDataObject = "dbo.UFN_System_Get_Menu",
                //        GridDataType = "function",
                //        GridParameters = SessionCollection.CurrentUserId.ToString(),
                //        GridDataAction = "count",
                //        FilterBy = controllerName + "/Partial" + actionName

                //    };

                //    int count = dataService.CountDataFromConfiguration(SessionCollection.CurrentUserId, gridConfig);

                //    if (count <= 0)
                //    {
                //        return RedirectToAction("Error", "Account"); 
                //    }
                //}

                return View();
            }
        }


        public ActionResult LoginView()
        {
            return RedirectToAction("Login", "Account");
        }
    }
}
