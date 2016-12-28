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

        #region object manangement
        public ActionResult MasterNode()
        {
            if (!SessionCollection.IsLogIn) return LoginView();
            return View();
        }

        public ActionResult MasterLink(int objectid = 0)
        {
            if (!SessionCollection.IsLogIn) return LoginView();
            dynamic model = new System.Dynamic.ExpandoObject();
            model.objectid = objectid;
            return View(model);
        }
        public ActionResult MasterZone()
        {
            if (!SessionCollection.IsLogIn) return LoginView();
            return View();
        }

        public ActionResult MasterDirection()
        {
            if (!SessionCollection.IsLogIn) return LoginView();
            return View();
        }

        public ActionResult MasterTransportLevel()
        {
            if (!SessionCollection.IsLogIn) return LoginView();
            return View();
        }
        public ActionResult MasterTransportGroup()
        {
            if (!SessionCollection.IsLogIn) return LoginView();
            return View();
        }

        #region Theo dõi giám sát
        public ActionResult MonitorDeviceStatus()
        {
            //if (!SessionCollection.IsLogIn) return LoginView();
            return View();
        }


        public ActionResult MonitorCCTV()
        {
            //if (!SessionCollection.IsLogIn) return LoginView();
            return View();
        }
        #endregion

        #region Quản lý thiết bị
        //==================================
        //VDS
        public ActionResult VDSDevice(int objectid = 0)
        {
            if (!SessionCollection.IsLogIn) return LoginView();
            dynamic model = new System.Dynamic.ExpandoObject();
            model.objectid = objectid;
            return View(model);
        }

        //==================================
        //VMS
        public ActionResult VMSDevice(int objectid = 0)
        {
            if (!SessionCollection.IsLogIn) return LoginView();
            dynamic model = new System.Dynamic.ExpandoObject();
            model.objectid = objectid;
            return View(model);
        }

        //==================================
        //CCTV
        public ActionResult CCTVDevice(int objectid = 0)
        {
            if (!SessionCollection.IsLogIn) return LoginView();
            dynamic model = new System.Dynamic.ExpandoObject();
            model.objectid = objectid;
            return View(model);
        }

        //Điểu khiển thiết bị
        public ActionResult CCTVControl()
        {
            if (!SessionCollection.IsLogIn) return LoginView();
            return View();
        }
        #endregion

        #endregion

    }
}
