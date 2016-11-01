using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Web;
using CHUNOApp.App_Code;
using RazorEngine;
using RazorEngine.Configuration; // For extension methods.
using RazorEngine.Templating;
using RazorEngine.Text;

namespace CHUNOApp.Template
{
    public class EditOnTableTemplate : iTemplate
    {
        public EditOnTableTemplate(int tableid)
            : base(tableid)
        {
            this.TemplateKey = "html/_edit_ontable/editontable_view";
        }

        public override void CreateView()
        {
            //tao model
            var model = this;

            //sinh template
            string result = GenerateHelper.CompileTemplate(this.TemplateKey, model);

            //luu file
            GenerateHelper.CreateFile(this.OutputFile, result);
        }

        

    }
}