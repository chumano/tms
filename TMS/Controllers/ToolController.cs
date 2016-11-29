using System;
using System.Data;
using System.Data.SqlClient;
using System.Threading.Tasks;
using System.Web;
using System.Web.Mvc;
using Common;
using Template;
using Microsoft.AspNet.Identity.Owin;
using ServiceStack.OrmLite;
using Service;

namespace TMS.Controllers
{
    public class ToolController : BaseController
    {
        public IDataService dataService;

        public ToolController(IDataService _dataService) : base(_dataService)
        {
            dataService = _dataService;
        }

        #region Views
        public ActionResult Index()
        {
            return DBTable();// RedirectPermanent("Tool/DBTable");
        }

        public ActionResult DBTable()
        {
            if (!SessionCollection.IsLogIn) return LoginView();

            return View("~/Views/CMS/Tool/DBTable.cshtml");
        }

       
        public ActionResult TempAutocomplete()
        {
            if (!SessionCollection.IsLogIn) return LoginView();

            return View("~/Views/CMS/Tool/TempAutocomplete.cshtml");
        }


        public ActionResult TempTables()
        {
            if (!SessionCollection.IsLogIn) return LoginView();

            return View("~/Views/CMS/Tool/TempTables.cshtml");
        }

        public ActionResult TempInputs()
        {
            if (!SessionCollection.IsLogIn) return LoginView();

            return View("~/Views/CMS/Tool/TempInputs.cshtml");
        }

        public ActionResult TestView()
        {
            if (!SessionCollection.IsLogIn) return LoginView();
            return View("~/Views/CMS/Tool/test_view.cshtml");
        }

        //custom-view
        public ActionResult TView(string viewname, int objectid=0)
        {
            if (!SessionCollection.IsLogIn) return LoginView();

            dynamic model = new System.Dynamic.ExpandoObject();
            model.objectid = objectid;

            return View("~/Views/CMS/Tool/Outputs/" + viewname + ".cshtml",model);
        }
        #endregion
        //==========================================================
        //==========================================================
        #region TOOL FUNCTIONS
        [HttpPost]
        public ActionResult GenerateDBTable()
        {
            try
            {
                //lấy tất các các bảng có trong db
                DataTable tbl = dataService.GetDataFromConfiguration(SessionCollection.CurrentUserId, new DataConfig()
                {
                    dataobject = "V_DBINF_ALLTable",
                    columns = "", //all columns
                    action = "getall",
                    sort = "TABLE_NAME asc"
                });

                DataTable dbtbl = dataService.GetDataFromConfiguration(SessionCollection.CurrentUserId, new DataConfig()
                {
                    dataobject = "T_TOOL_DBTable",
                    columns = "", //all columns //TableName ,TableTitle
                    action = "getall"
                });

                //=================================
                using (SqlConnection sqlConn = new SqlConnection(DBHelper.ConnectionString))
                {
                    sqlConn.Open();
                    foreach (DataRow row in tbl.Rows)
                    {
                        string table_name = row["TABLE_NAME"].ToString();

                        //kiểm tra trong bảng T_TOOL_DBTable có bảng này chưa
                        //nếu chưa có thì thêm vào
                        DataRow[] rs = dbtbl.Select("TableName='" + table_name + "'");
                        if (rs.Length == 0) //Chưa có thì thêm vào
                        {
                            DBHelper.ExecuteSql(sqlConn,
                                string.Format(
                                @"insert into T_TOOL_DBTable(TableName,TableTitle,IsActive) VALUES (N'{0}',N'{1}','True')",
                                table_name, table_name));
                        }
                    }
                }
                return Json(true);
            }
            catch (Exception ex)
            {
                return Json("#error:" + ex.Message);
            }
        }

        [HttpPost]
        public ActionResult GenerateTableConfig(int tableid, bool isupdate)
        {
            try
            {
                if (isupdate)
                {
                    //delete all
                    DBHelper.ExecuteSql(string.Format(@"Delete from 
                        T_TOOL_ConfigTable
                        WHere DBTableId= {0}", tableid));
                }
                //=========================================
                DataTable dbtbl = DBHelper.GetDataTable(string.Format(@"select * from 
                        T_TOOL_DBTable
                        Where Id={0}", tableid
                ));
                string tablename = dbtbl.Rows[0]["TableName"].ToString();

                //lấy columns infos từ database
                DataTable tblcolumninfo = DBHelper.GetDataTable(string.Format(@"select * from 
                        V_DBINF_TableColumnAllInfo
                        Where TABLE_NAME= '{0}'
                        ORder by TABLE_NAME asc",
                        tablename
                ));

                DataTable tblconfig = DBHelper.GetDataTable(string.Format(@"select * from 
                        T_TOOL_ConfigTable
                        WHere DBTableId= {0}", tableid
                ));

                //=================================
                using (SqlConnection sqlConn = new SqlConnection(DBHelper.ConnectionString))
                {
                    sqlConn.Open();
                    #region thêm/update những column
                    foreach (DataRow row in tblcolumninfo.Rows)
                    {
                        //lấy các info của col
                        string COLUMN_NAME = row["COLUMN_NAME"].ToString();
                        bool IS_NULLABLE = Convert.ToBoolean(row["IS_NULLABLE"]);

                        string DATA_TYPE = row["DATA_TYPE"].ToString();
                        int DATA_LENGTH = row["CHARACTER_MAXIMUM_LENGTH"] == DBNull.Value ? 0 : Convert.ToInt16(row["CHARACTER_MAXIMUM_LENGTH"]);

                        bool IS_PRIMARYKEY = Convert.ToBoolean(row["IS_PRIMARYKEY"]);

                        bool IS_FOREIGNKEY = Convert.ToBoolean(row["IS_FOREIGNKEY"]);
                        string REF_TABLE_NAME = row["REF_TABLE_NAME"].ToString();
                        string REF_COLUMN_NAME = row["REF_COLUMN_NAME"].ToString();

                        string COLUMN_DESC = row["COLUMN_DESC"].ToString();

                        //tự suy diễn info
                        bool IS_YEAR = COLUMN_NAME.ToUpper().Contains("YEAR_");
                        bool IS_IMAGE = COLUMN_NAME.ToUpper().Contains("IMG_");
                        bool IS_FILE = COLUMN_NAME.ToUpper().Contains("FILE_");

                        bool IS_FOREIGNKEY_ACTUALLY = IS_FOREIGNKEY && !IS_IMAGE && !IS_FILE;
                        string FOREIGNKEY_TYPE = IS_FOREIGNKEY_ACTUALLY ? "DROPDOWN" : ""; //"DROPDOWN" or "AUTOCOMPLETE"
                        string ForeignKey_Modal = IS_FOREIGNKEY_ACTUALLY ? "NONE" : ""; //"NONE" or "ON_FLY_MODAL"

                        string Foreign_Column_NameView = "";
                        if(IS_FOREIGNKEY_ACTUALLY)
                            Foreign_Column_NameView = FindColumnNameOfTable(REF_TABLE_NAME);
                        //=====================
                        bool IS_VIEW = (COLUMN_NAME != "Id") && (!IS_NULLABLE || IS_FOREIGNKEY_ACTUALLY || IS_YEAR || DATA_TYPE == "bit");
                        bool IS_FILTER = (IS_VIEW) 
                            && 
                            (IS_YEAR
                            || DATA_TYPE == "bit" 
                            || DATA_TYPE == "int" 
                            || DATA_TYPE == "varchar" 
                            || DATA_TYPE == "nvarchar"
                            || DATA_TYPE == "datetime"
                            );
                        string POSITION = "LEFT";

                        //=================================================================
                        //bỏ qua một số cột system
                        if (COLUMN_NAME == "Version"
                            || COLUMN_NAME == "IsActive"
                            || COLUMN_NAME == "CreatedBy"
                            || COLUMN_NAME == "CreatedDate"
                            || COLUMN_NAME == "ModifiedBy"
                            || COLUMN_NAME == "ModifiedDate")
                            continue;

                        //=================================================================
                        //kiểm tra trong bảng T_TOOL_ConfigTable có bảng này chưa
                        //nếu chưa có thì thêm vào
                        DataRow[] rs = tblconfig.Select("ColumnName='" + COLUMN_NAME + "'");

                        if (rs.Length == 0)
                        {
                            #region Chưa có thì thêm vào : insert
                            DBHelper.ExecuteSql(sqlConn,
                                string.Format(
                                @"insert into T_TOOL_ConfigTable([DBTableId]
                                          ,[ColumnName]
                                          ,[ColumnTitle]
                                          ,[ColumnType]
                                          ,[ColumnDesc]

                                          ,[IsForeignKey]
                                          ,[IsYear]
                                          ,[IsImage]
                                          ,[IsFile]

                                          ,[ForeignTable]  
                                          ,[ForeignColumnKey]    
                                          ,[ForeignColumnName]                                      
                                          ,[ForeignKeyType]
                                          ,[ForeignKeyModal]

                                          ,[IsNullable]
                                          ,[UI_IsView]
                                          ,[UI_IsFilter]
                                          ,[UI_Position]
                                    ) 
                                    VALUES ({0},N'{1}',N'{2}',N'{3}',N'{4}',
                                            {5},{6},{7},{8},
                                            N'{9}',N'{10}',N'{11}',N'{12}',N'{13}',
                                            {14},{15},{16},N'{17}'
                                            )",
                                    tableid,
                                    COLUMN_NAME,
                                    string.IsNullOrEmpty(COLUMN_DESC) ? COLUMN_NAME : COLUMN_DESC,
                                    DATA_TYPE,
                                    "",

                                    IS_FOREIGNKEY ? 1 : 0,
                                    IS_YEAR ? 1 : 0,
                                    IS_IMAGE ? 1 : 0,
                                    IS_FILE ? 1 : 0,

                                    REF_TABLE_NAME,
                                    REF_COLUMN_NAME,
                                    Foreign_Column_NameView,
                                    FOREIGNKEY_TYPE,
                                    ForeignKey_Modal,

                                    IS_NULLABLE ? 1 : 0,
                                    IS_VIEW ? 1 : 0,
                                    IS_FILTER ? 1 : 0,
                                    POSITION
                            ));
                            #endregion
                        }
                        else
                        {
                            #region có rồi và chọn isupdate thi update
                            if (isupdate)
                            {
                                DBHelper.ExecuteSql(sqlConn,
                                string.Format(
                                @"update T_TOOL_ConfigTable
                                    set    [ColumnTitle] = N'{2}'
                                          ,[ColumnType] = N'{3}'
                                          ,[ColumnDesc] = N'{4}'

                                          ,[IsForeignKey] = {5}
                                          ,[IsYear] = {6}
                                          ,[IsImage] = {7}
                                          ,[IsFile] = {8}

                                          ,[ForeignTable] = N'{9}'
                                          ,[ForeignColumnKey]  = N'{10}' 
                                          ,[ForeignColumnName] =N'{11}'
                                          ,[ForeignKeyType] = N'{12}'
                                          ,[ForeignKeyModal]  = N'{13}' 

                                          ,[IsNullable] = {14}
                                          ,[UI_IsView] = {15}
                                          ,[UI_IsFilter] = {16}
                                          ,[UI_Position] = N'{17}'
                                    WHERE DBTableId ={0} AND ColumnName=N'{1}'",
                                    tableid,
                                    COLUMN_NAME,
                                    string.IsNullOrEmpty(COLUMN_DESC) ? COLUMN_NAME : COLUMN_DESC,
                                    DATA_TYPE,
                                    "",

                                    IS_FOREIGNKEY ? 1 : 0,
                                    IS_YEAR ? 1 : 0,
                                    IS_IMAGE ? 1 : 0,
                                    IS_FILE ? 1 : 0,

                                    REF_TABLE_NAME,
                                    REF_COLUMN_NAME,
                                    Foreign_Column_NameView,
                                    FOREIGNKEY_TYPE,
                                    ForeignKey_Modal,

                                    IS_NULLABLE ? 1 : 0,
                                    IS_VIEW ? 1 : 0,
                                    IS_FILTER ? 1 : 0,
                                    POSITION
                                ));
                            }
                            #endregion
                        }
                    }
                    #endregion

                    #region delete column không còn
                    foreach (DataRow row in tblconfig.Rows)
                    {
                        string COLUMN_NAME = row["ColumnName"].ToString();

                        DataRow[] rs = tblcolumninfo.Select("COLUMN_NAME='" + COLUMN_NAME + "'");
                        if (rs.Length == 0) //Không còn tồn tại thì xóa đi                         {
                        {
                            DBHelper.ExecuteSql(sqlConn,
                               string.Format(@"delete from T_TOOL_ConfigTable
                                                 where DBTableId={0} AND ColumnName='{1}'",
                                                   tableid, COLUMN_NAME
                            ));
                        }
                    }
                    #endregion
                }
                return Json(true);
            }
            catch (Exception ex)
            {
                return Json("#error:" + ex.Message);
            }
        }

        [HttpPost]
        public ActionResult GenerateChildTableConfig(int tableid)
        {
            try
            {
                //delete all old
                DBHelper.ExecuteSql(string.Format(@"Delete from 
                        T_TOOL_ConfigTableChild
                        WHere DBTableId= {0}", tableid));

                //=========================================
                DataTable dbtbl = DBHelper.GetDataTable("select * from T_TOOL_DBTable Where Id=" + tableid);
                string tablename = dbtbl.Rows[0]["TableName"].ToString();

                //lấy nhung bảng con của table
                DataTable tblchid = DBHelper.GetDataTable(string.Format(@"select * from 
                            V_DBINF_TableColumnAllInfo 
                            Where IS_FOREIGNKEY=1 AND REF_TABLE_NAME= '{0}'
                             ORder by TABLE_NAME asc", tablename
                ));

                DataTable childtblconfig = DBHelper.GetDataTable(string.Format(@"select * from 
                        T_TOOL_ConfigTableChild
                        Where DBTableId= {0}", tableid
                ));

                //=================================
                using (SqlConnection sqlConn = new SqlConnection(DBHelper.ConnectionString))
                {
                    sqlConn.Open();
                    foreach (DataRow row in tblchid.Rows)
                    {
                        string table_name = row["TABLE_NAME"].ToString();
                        string column_name = row["COLUMN_NAME"].ToString();

                        DataTable childdbtbl = DBHelper.GetDataTable(string.Format(@"select * from 
                                T_TOOL_DBTable
                                WHERE TableName='{0}'", table_name
                        ));

                        if (childdbtbl.Rows[0]["Id"] == DBNull.Value) continue;

                        int childtableid = Convert.ToInt32(childdbtbl.Rows[0]["Id"]);

                        //kiểm tra trong bảng T_TOOL_ConfigTableChild có bảng này chưa
                        //nếu chưa có thì thêm vào
                        DataRow[] rs = childtblconfig.Select("DBChildTableId=" + childtableid + "");
                        if (rs.Length == 0) //Chưa có thì thêm vào
                        {
                            DBHelper.ExecuteSql(sqlConn,
                                string.Format(
                                @"insert into T_TOOL_ConfigTableChild(
                                              [DBTableId]
                                              ,[DBChildTableId]
                                              
                                              ,[IsOnlyOne]
                                              ,[ChildType]
                                              ,[IsUse]
                                              ,[RefColumn]
                                        ) 
                                        VALUES ({0},{1},{2},N'{3}',{4},N'{5}')",
                                tableid, childtableid, 0,
                                "ON_DETAIL_TAB", //ON_MASTER pr ON_DETAIL_TAB
                                0,
                                column_name
                                ));
                        }
                    }
                }
                return Json(true);
            }
            catch (Exception ex)
            {
                return Json("#error:" + ex.Message);
            }
        }
        
        [HttpPost]
        public ActionResult CreateView(int tableid, string viewtype)
        {
            try
            {
                iTemplate template = null;
                switch(viewtype){
                    case "SINGLE_VIEW":
                        template = new SingleViewTemplate(tableid);
                        break;
                    case "MASTER_DETAIL":
                        template = new MasterDetailViewTemplate(tableid);
                        break;
                    case "MASTER_SIDE":
                        template = new MasterSideViewTemplate(tableid);
                        break;
                    case "EDIT_ON_TABLE":
                        template = new EditOnTableTemplate(tableid);
                        break;
                }
                if (template == null) throw new Exception("not implement template [" + viewtype +"]");
                template.CreateView(Server.MapPath(MyConfig.OutputTemplateFolder));

                return Json(true);
            }
            catch (Exception ex)
            {
                return Json("#error:" + ex.Message);
            }
        }
        
        #endregion


        #region common static methods
        private static string FindColumnNameOfTable(string tablename)
        {
            string columnname = "Id";
            DataTable tblcolumninfo = DBHelper.GetDataTable(string.Format(@"select * from 
                        V_DBINF_TableColumnAllInfo
                        Where TABLE_NAME= '{0}'
                        ORder by TABLE_NAME asc",
                        tablename
                ));

            bool found = false;
            foreach (DataRow row in tblcolumninfo.Rows)
            {
                string COLUMN_NAME = row["COLUMN_NAME"].ToString();
                string DATA_TYPE = row["DATA_TYPE"].ToString();
                if (COLUMN_NAME == "Name"
                    || COLUMN_NAME.Contains("Name"))
                {
                    found = true;
                    columnname = COLUMN_NAME;
                    break;
                }
            }

            //====================================
            if (!found && tblcolumninfo.Rows.Count >= 2)
            {
                DataRow row = tblcolumninfo.Rows[1];
                columnname = row["COLUMN_NAME"].ToString();
            }

            return columnname;
        }
        #endregion
    }
}