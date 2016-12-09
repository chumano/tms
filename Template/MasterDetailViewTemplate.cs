using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Web;
using Common;
using Template.Common;

namespace Template
{
    public class MasterDetailViewTemplate : iTemplate
    {
        public List<TableInfo> ChildTables;

        public MasterDetailViewTemplate(int tableid)
            : base(tableid)
        {
            this.TemplateKey = "html._master_detail.test_masterdetail_view";
            //this.OutputFile = "test_masterdetail_view.cshtml"; //Là tên của bảng
            
            //========================
            this.ChildTables = new List<TableInfo>();
            
            #region load child table
            DataTable tblchild = DBHelper.GetDataTable(string.Format(@"select * from 
                        T_TOOL_ConfigTableChild
                        WHere DBTableId= {0} AND IsUse =1", tableid
               ));
            foreach (DataRow row in tblchild.Rows)
            {
                int DBChildTableId = Convert.ToInt32( row["DBChildTableId"]);
                bool IsOnlyOne = (bool)row["IsOnlyOne"];
                string ChildType = row["ChildType"].ToString();
                string RefColumn = row["RefColumn"].ToString();
                bool IsBaseTableType = (bool)row["IsBaseTableType"];

                TableInfo childtableinfo = new TableInfo();
                childtableinfo.IsOnlyOne = IsOnlyOne;
                childtableinfo.ChildType = ChildType;
                childtableinfo.RefColumn = RefColumn;
                childtableinfo.IsBaseTableType = IsBaseTableType;

                #region load thông tin của childtable
                DataTable tbl = DBHelper.GetDataTable(string.Format(@"select * from 
                        T_TOOL_DBTable
                        WHere Id= {0}", DBChildTableId
                  ));
                {
                    DataRow r = tbl.Rows[0];
                    var ChildTableName = r["TableName"].ToString();
                    var ChildTitle = r["TableTitle"].ToString();

                    childtableinfo.TableName = ChildTableName;
                    childtableinfo.Title = ChildTitle;
                }
                #endregion
                //==================
                #region load column info of childtable
                var columns = DataHelper.LoadColumnInfos(DBChildTableId);
                childtableinfo.Columns = columns;
                #endregion

                this.ChildTables.Add(childtableinfo);
            }
            #endregion

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
                if (tbl.IsBaseTableType)
                    template = GenerateHelper.CompileTemplate("js._master_detail.js_childtable_detail_ontab_basetabletype", tbl);
                else
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
                if (tbl.IsBaseTableType)
                    template = GenerateHelper.CompileTemplate("html._master_detail.childtable_detail_ontab_basetabletype", tbl);
                else
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
                if (tbl.IsBaseTableType)
                    template = GenerateHelper.CompileTemplate("js._master_detail.js_childtable_onmaster_basetabletype", tbl);
                else
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
                if (tbl.IsBaseTableType)
                    template = GenerateHelper.CompileTemplate("html._master_detail.childtable_onmaster_basetabletype", tbl);
                else
                    template = GenerateHelper.CompileTemplate("html._master_detail.childtable_onmaster", tbl);
            }
            return template;
        }
    }
}