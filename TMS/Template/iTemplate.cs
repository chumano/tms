using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Web;

using RazorEngine;
using RazorEngine.Configuration; // For extension methods.
using RazorEngine.Templating;

using CHUNOApp.App_Code;
using CHUNOApp.Helpers;

namespace CHUNOApp.Template
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
            this.Columns = LoadColumnInfos(tableid);
            #endregion

            //========================================
            //other info
            //========================================
            GenerateHelper.ClearTemplateCache();
           

        }


        public abstract void CreateView();
        #region HTML
        public static string HTML_Column_In_SearchForm(ColumnInfo col)
        {
            return GenerateHelper.CompileTemplate("html/share/col_on_searchform", col);
        }

        public static string HTML_Column_In_EditForm(ColumnInfo col)
        {
            return GenerateHelper.CompileTemplate("html/share/col_on_editform", col);
        }

        public static string HTML_Column_In_SearchEditForm(ColumnInfo col)
        {
            return GenerateHelper.CompileTemplate("html/share/col_on_searcheditform", col);
        }

        public static string HTML_COLUMN_IN_SEARCHEDITFORM_ON_MODAL(ColumnInfo col)
        {
            return GenerateHelper.CompileTemplate("html/share/col_on_searcheditform_on_modal", col);
        }
        //--------------------------------
        public static string HTML_Column_In_EditFormModal(ColumnInfo col)
        {
            return GenerateHelper.CompileTemplate("html/share/col_on_editform_modal", col);
        }

        public static string HTML_Column_In_ChildSearchForm(string childtable, ColumnInfo col)
        {
            dynamic model = col.ToDymanicObject();
            model.ChildTable = childtable;
            return GenerateHelper.CompileTemplate("html/share/col_on_childsearchform", model);
        }

        //===================================
        public static string HTML_Column_In_Table(ColumnInfo col)
        {
            return GenerateHelper.CompileTemplate("html/share/col_on_table", col);
        }

        public static string HTML_Column_In_EditTable(ColumnInfo col)
        {
            return GenerateHelper.CompileTemplate("html/_edit_ontable/col_on_edittable", col);
        }
        #endregion

        #region JS
        public static string JS_Column_On_NewObject(ColumnInfo col)
        {
            return GenerateHelper.CompileTemplate("js/share/js_col_on_newobject", col);
        }

        public static string JS_Column_On_Filter(ColumnInfo col)
        {
            return GenerateHelper.CompileTemplate("js/share/js_col_on_filter", col);
        }

        public static string JS_Column_On_FormConfig(ColumnInfo col)
        {
            return GenerateHelper.CompileTemplate("js/share/js_col_on_formconfig", col);
        }

        public static string JS_Column_Image_Save(ColumnInfo col)
        {
            return GenerateHelper.CompileTemplate("js/share/js_col_image_save", col);
        }

        public static string JS_Column_Image_Init_Hanlder(ColumnInfo col)
        {
            return GenerateHelper.CompileTemplate("js/share/js_col_image_init_handler", col);
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
        public static List<ColumnInfo> LoadColumnInfos(int tableid)
        {
            DataTable tblconfig = DBHelper.GetDataTable(string.Format(@"select * from 
                        T_TOOL_ConfigTable
                        WHere DBTableId= {0}", tableid
               ));

            List<ColumnInfo>  columns = new List<ColumnInfo>();

            foreach (DataRow row in tblconfig.Rows)
            {
                string ColumnName = row["ColumnName"].ToString();
                string ColumnTitle = row["ColumnTitle"].ToString();
                string ColumnType = row["ColumnType"].ToString().ToUpper();
                string ColumnDesc = row["ColumnDesc"].ToString();

                bool IsForeignKey = (bool)row["IsForeignKey"];
                bool IsYear = (bool)row["IsYear"];
                bool IsImage = (bool)row["IsImage"];
                bool IsFile = (bool)row["IsFile"];

                string ForeignTable = row["ForeignTable"].ToString();
                string ForeignColumnKey = row["ForeignColumnKey"].ToString();
                string ForeignColumnName = row["ForeignColumnName"].ToString();
                string ForeignKeyType = row["ForeignKeyType"].ToString();
                string ForeignKeyModal = row["ForeignKeyModal"].ToString();

                bool IsNullable = (bool)row["IsNullable"];
                bool UI_IsView = (bool)row["UI_IsView"];
                bool UI_IsFilter = (bool)row["UI_IsFilter"];
                string UI_Position = row["UI_Position"].ToString();

                ColumnInfo col = new ColumnInfo(ColumnName, ColumnType, IsNullable);
                col.Title = ColumnTitle;
                col.Description = ColumnDesc;

                col.IsForeignKey = IsForeignKey;
                col.IsFile = IsFile;
                col.IsImage = IsImage;
                col.IsYear = IsYear;

                col.ForeignTable = ForeignTable;
                col.ForeignColumnKey = ForeignColumnKey;
                col.ForeignColumnName = ForeignColumnName;
                col.ForeignKeyType = ForeignKeyType;
                col.ForeignKeyModal = ForeignKeyModal;

                col.IsView = UI_IsView;
                col.IsFilter = UI_IsFilter;
                col.Position = UI_Position;

                col.IsID = (ColumnName == "Id");
                //=================================
                bool isadd = true;
                if (col.IsID
                     || ColumnName == "Version"
                     || ColumnName == "IsActive"
                     || ColumnName == "CreatedBy"
                     || ColumnName == "CreatedDate"
                     || ColumnName == "ModifiedBy"
                     || ColumnName == "ModifiedDate")
                    isadd = false;

                if (isadd) columns.Add(col);
            }

            return columns;
        }
        #endregion
    }
}