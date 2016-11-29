using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Web;
using Common;
using RazorEngine;
using RazorEngine.Configuration; // For extension methods.
using RazorEngine.Templating;
using Template.Common;


namespace Template
{
    public abstract class iTemplate
    {
        //=======================================================
        //=======================================================
        //=====================MODEL PROPERTY====================
        private int DBTableId;
        public string TableName;
        public string Title;
        public List<ColumnInfo> Columns;
        
        //=================================
        //other info
        public string Bundle = "";

        //=======================================================
        //=======================================================
        //template info
        public string TemplateKey = "single_view";
        public string OutputFile = "test_single_view.cshtml";

        public iTemplate(int tableid)
        {
            DBTableId = tableid;
            //========================================
            //load dbtable
            DataTable tbl = DBHelper.GetDataTable(string.Format(@"select * from 
                        T_TOOL_DBTable
                        WHere Id= {0}", tableid
              ));
            {
                DataRow row = tbl.Rows[0];
                this.TableName = row["TableName"].ToString();
                this.Title = row["TableTitle"].ToString();

                this.OutputFile = this.TableName + ".cshtml";
            }
            //========================================
            #region load infocolumn
            this.Columns = DataHelper.LoadColumnInfos(tableid);
            #endregion

            //========================================
            //other info
            //========================================
            GenerateHelper.ClearTemplateCache();
           

        }


        public abstract void CreateView(string outputfolder);

        #region HTML
        public static string HTML_Column_In_SearchForm(string controllername, ColumnInfo col)
        {
            dynamic model = col.ToDymanicObject();
            model.Controller = controllername;
            return GenerateHelper.CompileTemplate("html.share.col_on_searchform", model);
        }

        public static string HTML_Column_In_EditForm(string controllername,ColumnInfo col)
        {
            dynamic model = col.ToDymanicObject();
            model.Controller = controllername;
            return GenerateHelper.CompileTemplate("html.share.col_on_editform", model);
        }

        public static string HTML_Column_In_SearchEditForm(string controllername, ColumnInfo col)
        {
            dynamic model = col.ToDymanicObject();
            model.Controller = controllername;
            return GenerateHelper.CompileTemplate("html.share.col_on_searcheditform", model);
        }

        public static string HTML_COLUMN_IN_SEARCHEDITFORM_ON_MODAL(string controllername, ColumnInfo col)
        {
            dynamic model = col.ToDymanicObject();
            model.Controller = controllername;
            return GenerateHelper.CompileTemplate("html.share.col_on_searcheditform_on_modal", model);
        }
        //--------------------------------
        public static string HTML_Column_In_EditFormModal(string controllername, ColumnInfo col)
        {
            dynamic model = col.ToDymanicObject();
            model.Controller = controllername;
            return GenerateHelper.CompileTemplate("html.share.col_on_editform_modal", model);
        }

        public static string HTML_Column_In_ChildSearchForm(string childtable, string controllername, ColumnInfo col)
        {
            dynamic model = col.ToDymanicObject();
            model.ChildTable = childtable;
            model.Controller = controllername;
            return GenerateHelper.CompileTemplate("html.share.col_on_childsearchform", model);
        }

        //===================================
        public static string HTML_Column_In_Table(string controllername, ColumnInfo col)
        {
            dynamic model = col.ToDymanicObject();
            model.Controller = controllername;
            return GenerateHelper.CompileTemplate("html.share.col_on_table", model);
        }

        public static string HTML_Column_In_EditTable(string controllername, ColumnInfo col)
        {
            dynamic model = col.ToDymanicObject();
            model.Controller = controllername;
            return GenerateHelper.CompileTemplate("html._edit_ontable.col_on_edittable", model);
        }
        #endregion

        #region JS
        public static string JS_Column_On_NewObject(string controllername, ColumnInfo col)
        {
            dynamic model = col.ToDymanicObject();
            model.Controller = controllername;
            return GenerateHelper.CompileTemplate("js.share.js_col_on_newobject", model);
        }

        public static string JS_Column_On_Filter(string controllername, ColumnInfo col)
        {
            dynamic model = col.ToDymanicObject();
            model.Controller = controllername;
            return GenerateHelper.CompileTemplate("js.share.js_col_on_filter", model);
        }

        public static string JS_Column_On_FormConfig(string controllername, ColumnInfo col)
        {
            dynamic model = col.ToDymanicObject();
            model.Controller = controllername;
            return GenerateHelper.CompileTemplate("js.share.js_col_on_formconfig", model);
        }

        public static string JS_Column_Image_Save(string controllername, ColumnInfo col)
        {
            dynamic model = col.ToDymanicObject();
            model.Controller = controllername;
            return GenerateHelper.CompileTemplate("js.share.js_col_image_save", model);
        }

        public static string JS_Column_Image_Init_Hanlder(string controllername, ColumnInfo col)
        {
            dynamic model = col.ToDymanicObject();
            model.Controller = controllername;
            return GenerateHelper.CompileTemplate("js.share.js_col_image_init_handler", model);
        }
        
        #endregion

        #region helper
        public static string ControllerName(string tablename)
        {
            return "controller_" + tablename;
        }

        public static string ColumnModal(string colname)
        {
            return "modal_" + colname ;
        }

        public static string TableDotColumn(string tablename, string col)
        {
            return tablename + "." +col;
        }

        public static string NameOfForeignColumn(string foregincol , string colname)
        {
            return foregincol + "_" + colname;
        }
        
        //===================
        
        #endregion
    }
}