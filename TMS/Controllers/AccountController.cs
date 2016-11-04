using System.Threading.Tasks;
using System.Web;
using System.Web.Mvc;
using Microsoft.AspNet.Identity.Owin;
using System;
using Service;

namespace TMS.Controllers
{
    public class AccountController : BaseController
    {
        public AccountController(IDataService _dataService)
            : base(_dataService)
        {
        }

        public ActionResult Login()
        {
            if (SessionCollection.IsLogIn)
            {
                return RedirectToAction(SessionCollection.DefaultAction, SessionCollection.DefaultController);
            }
            else
            {
                return View();
            }
        }

        [HttpGet]
        public ActionResult Info()
        {
            return PartialView("Info");
        }


        public ActionResult Error()
        {
            if (SessionCollection.IsLogIn)
            {
                return View();
            }
            else
            {
                return RedirectToAction("Login", "Account");
            }
        }


        [HttpPost]
        public ActionResult Login(string username, string password)
        {
            try
            {
                var result = dataService.Login(username, password);
                SessionCollection.CurrentUserId = (int)result["UserId"];
                SessionCollection.UserName = result["UserName"].ToString();
               
                SessionCollection.DefaultAction = result["DefaultAction"].ToString();
                SessionCollection.DefaultController = result["DefaultController"].ToString();
                SessionCollection.IsDeveloper = (bool)result["IsDeveloper"];
                SessionCollection.IsLogIn = true;
                return Json(true);
            }
            catch (Exception ex)
            {
                return Json(false);
            }
        }

        [HttpPost]
        public ActionResult Logout()
        {
            dataService.Logout(SessionCollection.CurrentUserId);
            SessionCollection.ClearSession();
            SessionCollection.IsLogOut = true;
            return Json(true);
        }

        
    }
}