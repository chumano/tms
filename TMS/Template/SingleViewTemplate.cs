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
    public class SingleViewTemplate : iTemplate
    {
        public SingleViewTemplate(int tableid)
            : base(tableid)
        {
            this.TemplateKey = "html/_single_view/test_single_view";
            //this.OutputFile = "test_single_view.cshtml"; //Là tên của bảng
        }

        public override void CreateView()
        {
            //string templatecontent = GenerateHelper.ReadTemplate(this.TemplateFile);
            //tao model
            var model = this;

            //sinh template
            string result = GenerateHelper.CompileTemplate(this.TemplateKey, model);

            //luu file
            GenerateHelper.CreateFile(this.OutputFile, result);
        }

        public string HTML_MODAL_COLUMN(ColumnInfo col)
        {
            string foreigntablename = col.ForeignTable;
            int tableid = findtableid(foreigntablename);
            if(tableid>0){
                SingleViewTemplate model = new SingleViewTemplate(tableid);
                try
                {
                    if (col.IsForeignKey && col.ForeignKeyModal == EForeignKeyModal.ON_FLY_MODAL)
                    {
                        return GenerateHelper.CompileTemplate("html/_single_view/col_modal", model);
                    }
                }
                catch (Exception ex)
                {
                }
            }
            
            return string.Format("<!-- {0} : NOT IS MODAL-->", col.Name);
        }

        public string JS_MODAL_COLUMN(ColumnInfo col)
        {
            string foreigntablename = col.ForeignTable;
            int tableid = findtableid(foreigntablename);
            if (tableid > 0)
            {
                SingleViewTemplate model = new SingleViewTemplate(tableid);
                try
                {
                    if (col.IsForeignKey && col.ForeignKeyModal == EForeignKeyModal.ON_FLY_MODAL)
                    {
                        return GenerateHelper.CompileTemplate("js/_single_view/js_col_modal", model);
                    }
                }
                catch (Exception ex)
                {
                }
            }
            
            return string.Format("/*-- {0} : NOT IS MODAL--*/", col.Name);
        }

        

        private int findtableid(string tablename)
        {
            DataTable tbl = DBHelper.GetDataTable(string.Format(@"select * from 
                        T_TOOL_DBTable
                        WHere TableName= '{0}' ", tablename
              ));
            int id = 0;
            if (tbl.Rows.Count > 0)
            {
                id = Convert.ToInt32(tbl.Rows[0]["Id"]);
            }
            return id;
        }


    }
}