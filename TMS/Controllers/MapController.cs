using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using Service;

namespace TMS.Controllers
{
    public class MapController : BaseController
    {
        public MapController(IDataService _dataService)
            : base(_dataService)
        {
        }

        public ActionResult Index()
        {
            if (!SessionCollection.IsLogIn) return LoginView();
            return View();
        }

    }
}
