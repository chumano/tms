using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Web;
using Common;
using RazorEngine;
using RazorEngine.Configuration; // For extension methods.
using RazorEngine.Templating;
using RazorEngine.Text;

namespace Template
{
    public class MasterSideViewTemplate : MasterDetailViewTemplate
    {

        public MasterSideViewTemplate(int tableid)
            : base(tableid)
        {
            this.TemplateKey = "html._master_side.master_side_view";
        }

        public override void CreateView(string outputfolder)
        {
            //tao model
            var model = this;

            //sinh template
            string result = GenerateHelper.CompileTemplate(this.TemplateKey, model);

            //luu file
            GenerateHelper.CreateFile(this.OutputFile, result, outputfolder);
        }

        //==================================
        //on detail tab
       
    }
}