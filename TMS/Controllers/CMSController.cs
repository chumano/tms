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
            return View("~/Views/CMS/Users.cshtml");
        }

        public ActionResult Roles()
        {
            return View("~/Views/CMS/Roles.cshtml");
        }

        public ActionResult Accounts()
        {
            return View("~/Views/CMS/Accounts.cshtml");
        }

        public ActionResult Authors()
        {
            return View("~/Views/CMS/Authors.cshtml");
        }
    }
}
