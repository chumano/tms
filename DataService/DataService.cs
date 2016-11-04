using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using System.Web;
using Common;
using ServiceStack.OrmLite;

namespace Service
{
    
    public class DataService : IDataService
    {
        OrmLiteConnectionFactory dbFactory;
        //=================================       
        #region Contrcuter
        public DataService()
        {
            OrmLiteConnectionFactory DBFactory = new OrmLiteConnectionFactory(
                 DBHelper.ConnectionString,
                SqlServerDialect.Provider);

            this.dbFactory = DBFactory;
        }
        #endregion
        
        //========================================
        #region Get List
        //========================================
        //get Json
        public IList<Dictionary<string, object>> GetDataFromConfigurationJsonable(int userId, DataConfig gridConfig)
        {
            List<Dictionary<string, object>> rows = new List<Dictionary<string, object>>();
            DataTable dt = GetDataFromConfiguration(userId, gridConfig);
            Dictionary<string, object> row;
            foreach (DataRow dr in dt.Rows)
            {
                row = new Dictionary<string, object>();
                foreach (DataColumn col in dt.Columns)
                {
                    if (dr[col] == DBNull.Value)
                    {
                        row.Add(col.ColumnName, "");
                    }
                    else
                    {
                        if (col.DataType == typeof(DateTime))
                        {
                            row.Add(col.ColumnName, Convert.ToDateTime(dr[col]).ToString("dd-MM-yyyy hh:mm:ss"));
                        }
                        else
                        {
                            row.Add(col.ColumnName, dr[col]);
                        }
                    }
                }
                rows.Add(row);
            }
            return rows;
        }

        //========================================
        //get DataTables
        public DataTable GetDataFromConfiguration(int userId, DataConfig config)
        {
            string statement;
            if (config.type == DataConfig.FunctionType)
            {
                statement = string.Format(
                    @"exec [dbo].[USP_System_Data_Function_Get] 
                            @UserId ={0}, @FunctionName = '{1}', @Parameter = N'{2}', @TextFilter = N'{3}', @Action = '{4}', 
                            @StartRow = {5}, @EndRow = {6}, @GlobalOrder = '{7}',
                            @GlobalOrderDirection = {8}, @ColumSum = '{9}'"
                    , userId, config.dataobject, config.functionparameters, 
                        "",//config.FilterByValue, 
                        config.action ,
                        config.startrow, config.endrow,
                        ""/*config.OrderBy*/, 1,//dconfig.OrderDirection, 
                        ""//config.GridSumColums
                        );
            }
            else
            {
                statement = string.Format(@"exec [dbo].[USP_System_Data_List_Get] 
                            @UserId ={0}, @TableName = '{1}', @Colums = '{2}', @Condition = N'{3}', 
                            @OrderColums = '{4}', @TextFilter = N'{5}',  @Action = '{6}', 
                            @StartRow = {7}, @EndRow = {8}, @GlobalOrder = '{9}',  
                            @GlobalOrderDirection = {10}, @ColumSum = '{11}';"
                    , userId, config.dataobject, config.columns, config.condition,
                        config.sort, "",//config.FilterByValue,
                        config.action,//config.GridDataAction, //getall/get/get10/sum/count/excel
                        config.startrow, config.endrow,
                        ""/*config.OrderBy*/, 1,//dconfig.OrderDirection, 
                        ""//config.GridSumColums
                        );
            }

            DataTable tbl = DBHelper.GetDataTable( statement);//text or sp
            return tbl;
        }

        //========================================
        //count
        public int CountDataFromConfiguration(int userId, DataConfig config)
        {
            string statement;
            if (config.type == DataConfig.FunctionType)
            {
                statement = string.Format(@"exec [dbo].[USP_System_Data_Function_Get] 
                    @UserId ={0}, @FunctionName = '{1}', @Parameter = N'{2}', 
                    @TextFilter = N'{3}', 
                    @Action = '{4}', 
                    @StartRow = {5}, @EndRow = {6}, 
                    @GlobalOrder = '{7}', @GlobalOrderDirection = {8}"

                    , userId, config.dataobject, config.functionparameters, 
                    config.condition, 
                    "count",
                    config.startrow, config.endrow, 
                    ""/*config.OrderBy*/, 1//dconfig.OrderDirection
                    );
            }
            else
            {
                statement = string.Format(@"exec [dbo].[USP_System_Data_List_Get] 
                    @UserId ={0}, @TableName = '{1}', @Colums = '{2}', 
                    @Condition = N'{3}',
                    @OrderColums = '{4}', @TextFilter = N'{5}', 
                    @Action = '{6}', 
                    @StartRow = {7}, @EndRow = {8},
                    @GlobalOrder = '{9}', @GlobalOrderDirection = {10}"

                    , userId, config.dataobject, config.columns, 
                    config.condition,
                    config.sort, 
                    "",// gridConfig.FilterByValue, 
                    "count",
                    config.startrow, config.endrow,
                    ""/*config.OrderBy*/, 1//dconfig.OrderDirection
                    );
            }

            int count = 0;
            using (var db = dbFactory.OpenDbConnection())
            {
                count = db.Scalar<int>(statement);
            }
            return count;
        }

        //========================================
        //sum
        public Dictionary<string, object> SumDataFromConfiguration(int userId, DataConfig config)
        {
            config.action = "sum";
            //gridConfig.FilterBy
            return GetDataFromConfigurationJsonable(userId, config).First();
        }

        //========================================
        //get Rules
        public Dictionary<string, object> GetRules(int userId, DataConfig config)
        {
            DataTable dt = GetDataFromConfiguration(userId, config);
            Dictionary<string, object> result = new Dictionary<string, object>();
            foreach (DataRow dr in dt.Rows)
            {
                result.Add(dr["RuleName"].ToString(), dr["Value"]);
            }
            return result;
        }
        #endregion

        //========================================
        #region Object
        //========================================
        //get
        public Dictionary<string, object> GetObject(int userId, string tableName, string columName, string columValue)
        {
            string statement = string.Format("exec [dbo].[USP_System_Data_Object_Get] @UserId = {0}, @TableName = '{1}', @ColumName = '{2}', @Value = N'{3}'"
                    , userId, tableName, columName, columValue);

            DataTable tbl = null;
            using (var db = dbFactory.OpenDbConnection())
            {
                tbl = DBHelper.GetDataTable(db, statement);
            }

            //====================
            Dictionary<string, object> row;
            foreach (DataRow dr in tbl.Rows) //an only row
            {
                row = new Dictionary<string, object>();
                foreach (DataColumn col in tbl.Columns)
                {
                    row.Add(col.ColumnName, dr[col]);
                }
                return row;
            }

            return null;
        }
    
        //========================================
        // save
        public int SaveObject(int userId, string tableName, string objectData)
        {
            objectData = objectData.Replace("'", "''");
            string statement = string.Format("exec [dbo].[USP_System_Data_Update] @TableName = '{0}', @Data = N'{1}', @UserId = {2}"
                    , tableName, objectData, userId);

            int result = 0;
            using (var db = dbFactory.OpenDbConnection())
            {
                result =  db.Scalar<int>(statement);
            }
            return result;
        }

        public void SaveListObject(int userId, string tableName, string objectData)
        {
            objectData = objectData.Replace("'", "''");
            string statement = string.Format("exec [dbo].[USP_System_Data_BulkUpdate] @TableName = '{0}', @Data = N'{1}', @UserId = {2}"
                    , tableName, objectData, userId);

            using (var db = dbFactory.OpenDbConnection())
            {
                db.ExecuteNonQuery(statement);
            }
        }

        public int SaveComplexObject(int userId, string tableName, string objectData, string subTableName, string subObjectData)
        {
            objectData = objectData.Replace("'", "''");
            subObjectData = subObjectData.Replace("'", "''");
            string statement = string.Format("exec [dbo].[USP_System_Data_ComplexObject_Update] @TableName = '{0}', @Data = N'{1}', @SubTableName = '{2}', @DataList = N'{3}', @UserId = {4}"
                    , tableName, objectData, subTableName, subObjectData, userId);

            int result = 0;
            using (var db = dbFactory.OpenDbConnection())
            {
                result = db.Scalar<int>(statement);
            }
            return result;
        }

        //========================================
        //delete
        //if isHardDelete = false then only set IsActive = 0, not actually delete data
        public void DeleteObject(int userId, string tableName, int keyValue, bool isHardDelete)
        {
            string statement = string.Format("exec [dbo].[USP_System_Data_Object_Delete] @UserId = {0}, @TableName = '{1}', @Value = {2}, @IsHardDelete = {3}"
                    , userId, tableName, keyValue, isHardDelete ? "1" : "0");

            using (var db = dbFactory.OpenDbConnection())
            {
                DBHelper.ExecuteSql(db,statement);
            }
        }
        
        #endregion

        //========================================
        #region Check
        public bool CheckCanCreate(int userId, string tableName)
        {
            string statement = string.Format("select [dbo].[UFN_System_Check_Role_Object] ( {0}, '{1}', '{2}')",
                    userId, tableName, "update");

            bool result;
            using (var db = dbFactory.OpenDbConnection())
            {
                result = db.Scalar<bool>(statement);
            }
            return result;
        }

        public bool CheckField(int userId, string field)
        {
            string statement = string.Format("select [dbo].[UFN_System_Check_Role_Field] ( {0}, '{1}')",
                    userId, field);

            bool result;
            using (var db = dbFactory.OpenDbConnection())
            {
                result = db.Scalar<bool>(statement);
            }
            return result;
        }

       
        #endregion

        //========================================
        public Dictionary<string, object> Login(string username, string password)
        {
            string statement = string.Format("exec [dbo].[USP_System_Login] @Login = '{0}', @Password = '{1}'", username, password);

            DataTable tbl = null;
            using (var db = dbFactory.OpenDbConnection())
            {
                tbl = DBHelper.GetDataTable(db, statement);
            }

            //====================
            Dictionary<string, object> row;
            foreach (DataRow dr in tbl.Rows)
            {
                row = new Dictionary<string, object>();
                foreach (DataColumn col in tbl.Columns)
                {
                    row.Add(col.ColumnName, dr[col]);
                }
                return row;
            }

            return null;
        }

        public void Logout(int userId)
        {
            string statement = string.Format("exec [dbo].[USP_System_Logout] @UserId = {0}", userId);

            DBHelper.ExecuteSql(statement);
        }

        public IList<Dictionary<string, object>> ExecuteSQL(int userId, string sql)
        {
            List<Dictionary<string, object>> rows = new List<Dictionary<string, object>>();
            DataTable tbl =null;

            using (var db = dbFactory.OpenDbConnection())
            {
                tbl = DBHelper.GetDataTable(db, sql);
            }

            //================================
            if (tbl!=null)
            {
                Dictionary<string, object> row;
                foreach (DataRow dr in tbl.Rows)
                {
                    row = new Dictionary<string, object>();
                    foreach (DataColumn col in tbl.Columns)
                    {
                        if (dr[col] == DBNull.Value)
                        {
                            row.Add(col.ColumnName, "");
                        }
                        else
                        {
                            if (dr[col] is DateTime)
                            {
                                row.Add(col.ColumnName, ((DateTime)dr[col]).ToString("yyyy-MM-dd hh:mm:ss"));
                            }
                            else
                            {
                                row.Add(col.ColumnName, dr[col]);
                            }
                        }
                    }
                    rows.Add(row);
                }
            }
            else
            {
                Dictionary<string, object> row = new Dictionary<string, object>();
                row.Add("Result", "SQL được thực thi thành công!");
                rows.Add(row);
            }

            return rows;
        }

    }
}