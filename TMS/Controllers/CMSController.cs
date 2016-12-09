using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using Service;

namespace TMS.Controllers
{
    public class CMSController : BaseController
    {
        public IDataService dataService;

        public CMSController(IDataService _dataService): base(_dataService)
        {
            dataService = _dataService;
        }

        [HttpGet]
        public ActionResult Index()
        {
            return CheckSession();
        }

        public ActionResult Users()
        {
            if (!SessionCollection.IsLogIn) return LoginView();
            return View("~/Views/CMS/Users.cshtml");
        }

        public ActionResult Roles()
        {
            if (!SessionCollection.IsLogIn) return LoginView();
            return View("~/Views/CMS/Roles.cshtml");
        }

        public ActionResult Accounts()
        {
            if (!SessionCollection.IsLogIn) return LoginView();
            return View("~/Views/CMS/Accounts.cshtml");
        }

        public ActionResult Authors()
        {
            if (!SessionCollection.IsLogIn) return LoginView();
            return View("~/Views/CMS/Authors.cshtml");
        }


        public ActionResult Map()
        {
            //if (!SessionCollection.IsLogIn) return LoginView();
            return View();
        }
    }
}
