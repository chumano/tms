using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using System.Web;
using RazorEngine;
using RazorEngine.Configuration; // For extension methods.
using RazorEngine.Templating;
using RazorEngine.Text;


namespace CHUNOApp.Template
{
    public static class GenerateHelper
    {
        static IRazorEngineService Service { get; set; }
        static TemplateServiceConfiguration Configuration { get; set; }

        static GenerateHelper()
        {
            var config = new TemplateServiceConfiguration();
            // .. configure your instance
            config.EncodedStringFactory = new RawStringFactory();
            config.TemplateManager = new MyTemplateManager(GetTemplateFolder());
            var service = RazorEngineService.Create(config);
            Engine.Razor = service;

            //===================
            Configuration = config;
            Service = service;
        }

        public static string randomstring()
        {
            return Guid.NewGuid().ToString();
        }
        public static void test()
        {
            


            Generate_SimpleView(8);
            //===========================================
            #region test
            string template = "Hello @Model.Name, welcome to RazorEngine!";
            var result = Engine.Razor.RunCompile(template, "templateKey", null, new { Name = "World" });
            
            //=========================
            string templateFile = "html/test.cshtml";
            template = ReadTemplate(templateFile);
            result = Engine.Razor.RunCompile(template, "template_test", null, new { Name = "chumano" });

            CreateFile("test.cshtml", result);

            
            //========================
            iTemplate t = new SingleViewTemplate(8);
            StringBuilder sb = new StringBuilder();
            foreach (ColumnInfo col in t.Columns)
            {
                sb.Append(iTemplate.HTML_Column_In_SearchEditForm(col));
            }
            CreateFile("col_on_searcheditform.cshtml", sb.ToString());
            #endregion
        }

        public static void Generate_SimpleView(int tableid)
        {
            iTemplate template = new SingleViewTemplate(tableid);
            template.CreateView();

        }
        #region common
        public static void ClearTemplateCache()
        {
            Configuration.CachingProvider = new RazorEngine.Templating.DefaultCachingProvider(); 
        }
        public static string GetOutputFolder()
        {
            // System.Web.Hosting.HostingEnvironment.MapPath().
            var p = "~/Views/CMS/Tool/Outputs/"; //"~/App_Data/outputs/"
            string path = HttpContext.Current.Server.MapPath(p);
            return path;
        }

        public static string GetTemplateFolder()
        {
            // System.Web.Hosting.HostingEnvironment.MapPath().
            string path = HttpContext.Current.Server.MapPath("~/App_Data/templates/");
            return path;
        }

        public static void CreateFile(string filename, string content)
        {
            string filepath = GetOutputFolder() + filename;

            //replate some specific things
            //content = content.Replace("RAZOR_(A)", "@");
            System.IO.File.WriteAllText(filepath, content, System.Text.Encoding.UTF8);
        }

        public static string ReadTemplate(string filename)
        {
            string templatePath = GetTemplateFolder() + filename;
            string template = File.ReadAllText(templatePath);

            return template;
        }

        
        public static string CompileTemplate(string templatekey, object model)
        {
            //templatecontent đã được lấy từ MyTemplateManager
            return Engine.Razor.RunCompile(templatekey, null, model);
        }

        //public static string CompileTemplate(string template, string templatekey, object model)
        //{
        //    return Engine.Razor.RunCompile(template, templatekey, null, model);
        //}

        //public static string CompileTemplateFromFile(string filepath, string templatekey, object model)
        //{
        //    string template = ReadTemplate(filepath);
        //    return CompileTemplate(template, templatekey, model);
        //}
        #endregion
    }

    public class MyTemplateManager : ITemplateManager
    {
        private readonly string baseTemplatePath;
        public MyTemplateManager(string basePath)
        {
            baseTemplatePath = basePath;
        }

        public ITemplateSource Resolve(ITemplateKey key)
        {
            string template = key.Name;
            string path = Path.Combine(baseTemplatePath, string.Format("{0}{1}", template, ".cshtml"));
            string content = File.ReadAllText(path);
            return new LoadedTemplateSource(content, path);
        }

        public ITemplateKey GetKey(string name, ResolveType resolveType, ITemplateKey context)
        {
            return new NameOnlyTemplateKey(name, resolveType, context);
        }

        public void AddDynamic(ITemplateKey key, ITemplateSource source)
        {
            throw new NotImplementedException("dynamic templates are not supported!");
        }
    }
}