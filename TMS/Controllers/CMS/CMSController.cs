using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace CHUNOApp.Controllers.CMS
{
    public class CMSController : Controller
    {
        //
        // GET: /TAuthor/

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
