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
        public string JS_ChildTable_Detail_OnTab(TableInfo tbl)
        {
            string template = "";
            if (tbl.IsOnlyOne)
            {
                template = GenerateHelper.CompileTemplate("js._master_detail.js_childtable_detail_ontab_only", tbl);
            }
            else
            {
                template = GenerateHelper.CompileTemplate("js._master_detail.js_childtable_detail_ontab", tbl);
            }
            return template;
        }

        public string HTML_ChildTable_Detail_OnTab(TableInfo tbl)
        {
            string template = "";
            if (tbl.IsOnlyOne)
            {
                template = GenerateHelper.CompileTemplate("html._master_detail.childtable_detail_ontab_only", tbl);
            }
            else
            {
                template = GenerateHelper.CompileTemplate("html._master_detail.childtable_detail_ontab", tbl);
            }
            return template;
        }

        //====================================
        //on master
        public string JS_ChildTable_OnMaster(TableInfo tbl)
        {
            string template = "";
            if (tbl.IsOnlyOne)
            {
                template = GenerateHelper.CompileTemplate("js._master_detail.js_childtable_onmaster_only", tbl);
            }
            else
            {
                template = GenerateHelper.CompileTemplate("js._master_detail.js_childtable_onmaster", tbl);
            }
            return template;
        }

        public string HTML_ChildTable_OnMaster(TableInfo tbl)
        {
            string template = "";
            if (tbl.IsOnlyOne)
            {
                template = GenerateHelper.CompileTemplate("html._master_detail.childtable_onmaster_only", tbl);
            }
            else
            {
                template = GenerateHelper.CompileTemplate("html._master_detail.childtable_onmaster", tbl);
            }
            return template;
        }
   
    }
}