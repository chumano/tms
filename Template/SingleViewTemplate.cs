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
using Template.Common;

namespace Template
{
    public class SingleViewTemplate : iTemplate
    {
        public SingleViewTemplate(int tableid)
            : base(tableid)
        {
            this.TemplateKey = "html._single_view.test_single_view";
            //this.OutputFile = "test_single_view.cshtml"; //Là tên của bảng
        }

        public override void CreateView(string outputfolder)
        {
            //string templatecontent = GenerateHelper.ReadTemplate(this.TemplateFile);
            //tao model
            var model = this;

            //sinh template
            string result = GenerateHelper.CompileTemplate(this.TemplateKey, model);

            //luu file
            GenerateHelper.CreateFile(this.OutputFile, result, outputfolder);
        }

        public string HTML_MODAL_COLUMN(ColumnInfo col)
        {
            string foreigntablename = col.ForeignTable;
            int tableid = DataHelper.FindTableID(foreigntablename);
            if(tableid>0){
                SingleViewTemplate model = new SingleViewTemplate(tableid);

                if (col.IsForeignKey && col.ForeignKeyModal == EForeignKeyModal.ON_FLY_MODAL)
                {
                    return GenerateHelper.CompileTemplate("html._single_view.col_modal", model);
                }

            }
            
            return string.Format("<!-- {0} : NOT IS MODAL-->", col.Name);
        }

        public string JS_MODAL_COLUMN(ColumnInfo col)
        {
            string foreigntablename = col.ForeignTable;
            int tableid = DataHelper.FindTableID(foreigntablename);
            if (tableid > 0)
            {
                SingleViewTemplate model = new SingleViewTemplate(tableid);

                if (col.IsForeignKey && col.ForeignKeyModal == EForeignKeyModal.ON_FLY_MODAL)
                {
                    return GenerateHelper.CompileTemplate("js._single_view.js_col_modal", model);
                }
               
            }
            
            return string.Format("/*-- {0} : NOT IS MODAL--*/", col.Name);
        }

        

        

    }
}