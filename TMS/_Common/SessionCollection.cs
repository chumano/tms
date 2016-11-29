using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace TMS
{
    public static class SessionCollection
    {
        public static bool IsLogIn
        {
            get
            {
                return HttpContext.Current.Session["IsLogIn"] == null ? false : (bool)HttpContext.Current.Session["IsLogIn"];
            }
            set
            {
                HttpContext.Current.Session["IsLogIn"] = value;
            }
        }

        public static bool IsLogOut
        {
            get
            {
                return HttpContext.Current.Session["IsLogOut"] == null ? false : (bool)HttpContext.Current.Session["IsLogOut"];
            }
            set
            {
                HttpContext.Current.Session["IsLogOut"] = value;
            }
        }

        //======================================================
        //user info
        public static int CurrentUserId
        {
            get
            {
                return HttpContext.Current.Session["CurrentUserId"] != null ? (int)HttpContext.Current.Session["CurrentUserId"] : -1;
            }
            set
            {
                HttpContext.Current.Session["CurrentUserId"] = value;
            }
        }

        public static string UserName
        {
            get
            {
                return (string)HttpContext.Current.Session["UserName"];
            }
            set
            {
                HttpContext.Current.Session["UserName"] = value;
            }
        }

        public static int CurrentAccountId
        {
            get
            {
                return HttpContext.Current.Session["CurrentAccountId"] != null ? (int)HttpContext.Current.Session["CurrentAccountId"] : -1;
            }
            set
            {
                HttpContext.Current.Session["CurrentAccountId"] = value;
            }
        }

        public static string RoleName
        {
            get
            {
                return (string)HttpContext.Current.Session["RoleName"];
            }
            set
            {
                HttpContext.Current.Session["RoleName"] = value;
            }
        }

        //======================================================
        public static void ClearSession()
        {
            HttpContext.Current.Session.Clear();
        }
        //======================================================
        

        public static Dictionary<string, object> ExportObjectData
        {
            get
            {
                return (Dictionary<string, object>)HttpContext.Current.Session["ExportObjectData"];
            }
            set
            {
                HttpContext.Current.Session["ExportObjectData"] = value;
            }
        }

        public static string ExportTemplate
        {
            get
            {
                return (string)HttpContext.Current.Session["ExportTemplate"];
            }
            set
            {
                HttpContext.Current.Session["ExportTemplate"] = value;
            }
        }


        //======================================================

        public static string DefaultAction
        {
            get
            {
                return (string)HttpContext.Current.Session["DefaultAction"];
            }
            set
            {
                HttpContext.Current.Session["DefaultAction"] = value;
            }
        }

        public static string DefaultController
        {
            get
            {
                return (string)HttpContext.Current.Session["DefaultController"];
            }
            set
            {
                HttpContext.Current.Session["DefaultController"] = value;
            }
        }

        public static string LastUrl
        {
            get
            {
                return (string)HttpContext.Current.Session["LastUrl"];
            }
            set
            {
                HttpContext.Current.Session["LastUrl"] = value;
            }
        }

        public static bool IsDeveloper
        {
            get
            {
                return HttpContext.Current.Session["IsDeveloper"] != null ? (bool)HttpContext.Current.Session["IsDeveloper"] : false;
            }
            set
            {
                HttpContext.Current.Session["IsDeveloper"] = value;
            }
        }
        //======================================================
    }
}