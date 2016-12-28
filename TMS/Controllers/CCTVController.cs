using System;
using System.Collections.Generic;
using System.Configuration;
using System.IO;
using System.Linq;
using System.Net;
using System.Web;
using System.Web.Mvc;
using Service;

namespace TMS.Controllers
{
    public class CCTVController : BaseController
    {
        static WebRequest WReq;
        public CCTVController(IDataService _dataService)
            : base(_dataService)
        {
            String MyURI = "http://172.28.12.102/jpg/image.jpg";
            WReq= WebRequest.Create(MyURI);
            WReq.Credentials = new NetworkCredential("root", "root");
        }
        //=================================================
        //Control
        public ActionResult Control(int cctvid, string par, string value)
        {
            try
            {
                var server = "172.28.12.102";
                var url = string.Format("http://{0}/axis-cgi/com/ptz.cgi?{1}={2}",server, par, value);
                var req = WebRequest.Create(url);
                req.Credentials = new NetworkCredential("root", "root");
                var response = req.GetResponse();
            }catch(Exception ex){
                return Json("#error: CCTVController.Control - " + ex.Message );
            }
            return Json(true);
        }
        //=================================================
        // GET: /CCTV/
        public ActionResult LiveView()
        {
            try
            {
                var path = "";
                var filename = "noimage.jpg";

                path = Server.MapPath(ConfigurationManager.AppSettings["DefaultImage"]);
                filename = Path.GetFileName(path);
                var ext = Path.GetExtension(path);
                var image = getStreamImg();
                byte[] data = imageToByteArray(image);
                //return new FileStreamResult(new FileStream(path, FileMode.Open), "image/jpeg");
                //return File(path, string.Format("image/{0}", ext), filename);
                return File(data, "image/jpeg");
            }
            catch
            {
                return null;
            }
        }

        public ActionResult Stream()
        {
            var stream = getStreamVideo();
            return new FileStreamResult(stream, "video/x-motion-jpeg");
        }
        //===================================
        System.IO.Stream getStreamVideo()
        {
            String MyURI = "http://172.28.12.200/mjpg/video.mjpg";
            WebRequest WReq = WebRequest.Create(MyURI);
            WReq.Credentials = new NetworkCredential("root", "root");
            return WReq.GetResponse().GetResponseStream();
        }

        System.Drawing.Image getStreamImg()
        {

            String MyURI = "http://172.28.12.200/jpg/image.jpg";
            //String MyURI = "http://192.168.0.90/mjpg/video.mjpg";
           
            var img = System.Drawing.Image.FromStream(WReq.GetResponse().GetResponseStream());
            return img;
        }

        public byte[] imageToByteArray(System.Drawing.Image imageIn)
        {
            using (var ms = new System.IO.MemoryStream())
            {
                imageIn.Save(ms, System.Drawing.Imaging.ImageFormat.Gif);
                return ms.ToArray();
            }
        }
    }
}
