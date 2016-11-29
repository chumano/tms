using System;
using System.Collections.Generic;
using System.Configuration;
using System.IO;
using System.Linq;
using System.Threading;
using System.Web;
using System.Web.Mvc;
using Common;
using Service;

namespace TMS.Controllers
{
    public class DataController : Controller
    {
        public IDataService dataService;

        public DataController(IDataService _dataService)
        {
            dataService = _dataService;
        }

        public ActionResult GetData(DataConfig config)
        {
            try
            {
                var list = dataService.GetDataFromConfigurationJsonable(SessionCollection.CurrentUserId, config);
                return Json(list);
            }
            catch (Exception ex)
            {
                return Json("#error:" + ex.Message);
            }
        }

        public ActionResult CountData(DataConfig config)
        {
            try
            {
                int count = dataService.CountDataFromConfiguration(SessionCollection.CurrentUserId, config);
                return Json(count);
            }
            catch (Exception ex)
            {
                return Json("#error:" + ex.Message);
            }
        }


        //==============================================================================
        [HttpPost]
        public ActionResult SaveObject(string tableName, string data)
        {
            try
            {
                int id = dataService.SaveObject(SessionCollection.CurrentUserId, tableName, data);
                return Json(id);
            }
            catch (Exception ex)
            {
                return Json("#error:" + ex.Message);
            }
        }

        [HttpPost]
        public ActionResult SaveListObject(string tableName, string data)
        {
            try
            {
                dataService.SaveListObject(SessionCollection.CurrentUserId, tableName, data);
                return Json(true);
            }
            catch (Exception ex)
            {
                return Json("#error:" + ex.Message);
            }
        }

        [HttpPost]
        public ActionResult SaveComplexObject(string tableName, string data, string subObject, string listData)
        {
            try
            {
                int id = dataService.SaveComplexObject(SessionCollection.CurrentUserId, tableName, data, subObject, listData);
                return Json(id);
            }
            catch (Exception ex)
            {
                return Json("#error:" + ex.Message);
            }
        }

        //==============================================================================
        [HttpPost]
        public ActionResult GetObject(string tableName, string columName, string columValue)
        {
            try
            {
                var obj = dataService.GetObject(SessionCollection.CurrentUserId, tableName, columName, columValue);
                if (obj == null) obj = new Dictionary<string, object>();
                return Json(obj);
            }
            catch (Exception ex)
            {
                return Json("#error:" + ex.Message);
            }
        }

        //==============================================================================
        [HttpPost]
        public ActionResult DeleteObject(string tableName, int keyValue, bool isHardDelete = false)
        {
            try
            {
                dataService.DeleteObject(SessionCollection.CurrentUserId, tableName, keyValue, isHardDelete);
                return Json(true);
            }
            catch (Exception ex)
            {
                return Json("#error:" + ex.Message);
            }
        }

        //==============================================================================
        [HttpPost]
        public ActionResult SaveImage()
        {
            try
            {
                if (Request.Files.Count > 0)
                {
                    var file = Request.Files[0];
                    var name_only = Path.GetFileNameWithoutExtension(file.FileName);
                    var ext = Path.GetExtension(file.FileName);

                    var img_name = string.Format("{0}_{1}.{2}", name_only, Guid.NewGuid(), ext);
                    string path = ConfigurationManager.AppSettings["ImagePath"] + img_name;

                    file.SaveAs(Server.MapPath(path));

                    return SaveObject("T_Master_Images",
                        string.Format("{0},,{1},,{2},,{3}",
                                    string.Format("{0}::{1}", "Name", name_only),
                                    string.Format("{0}::{1}", "Path", path),
                                    string.Format("{0}::{1}", "IsActive", true),
                                    string.Format("{0}::{1}", "Version", 1)
                                ));

                }

                return Json("#error:" + "No file exists");
            }
            catch (Exception ex)
            {
                return Json("#error:" + ex.Message);
            }
        }

        public ActionResult GetImage(int Id = 0)//imgid
        {
            try
            {
                var path = "";
                var filename = "noimage.jpg";
                if (Id <= 0)
                {
                    path = Server.MapPath(ConfigurationManager.AppSettings["DefaultImage"]);
                }
                else
                {
                    var obj = dataService.GetObject(SessionCollection.CurrentUserId, "T_Master_Images", "", Id.ToString());
                    path = Server.MapPath(obj["Path"].ToString());
                }

                filename = Path.GetFileName(path);
                var ext = Path.GetExtension(path);
                return File(path, string.Format("image/{0}", ext), filename);
            }
            catch (Exception ex)
            {
                return Json("#error:" + ex.Message);
            }
        }
    
    }


}
