using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using System.Web;
using ServiceStack.DataAccess;

namespace CHUNOApp.App_Code
{
    public class DBHelper
    {
        //Data Connection
        //Server=CHUNO\SQLEXPRESS2012;Database=TMS;Integrated Security=False;User Id=sa;Password=371319855;
        public static string ConnectionString = System.Configuration.ConfigurationManager.ConnectionStrings["TMSConnectionString"].ConnectionString;

        #region GetDataTable
        public static DataTable GetDataTable(string query)
        {
            DataTable tbl = null;
            using (SqlConnection sqlConn = new SqlConnection(ConnectionString))
            {
                tbl = GetDataTable(sqlConn, query);
            }

            return tbl;
        }
        public static DataTable GetDataTable(IDbConnection dbConn, string query)
        {
            var adoNetConn = ((IHasDbConnection)dbConn).DbConnection;
            var sqlConn = adoNetConn as SqlConnection;

            return GetDataTable(sqlConn, query);
        
        }
        public static DataTable GetDataTable(SqlConnection sqlConn, string query)
        {
            //SqlConnection sqlConn = (SqlConnection)dbFactory.GetContext().Database.Connection;
            SqlCommand cmdReport = new SqlCommand(query, sqlConn);
            SqlDataAdapter daReport = new SqlDataAdapter();
            daReport.SelectCommand = cmdReport;
            DataSet retVal = new DataSet();
            using (cmdReport)
            {
                cmdReport.CommandType = CommandType.Text;
                daReport.Fill(retVal);
            }
            return retVal.Tables[0];
        }
        #endregion

        #region ExecuteSql
        public static void ExecuteSql(string query)
        {
            using (SqlConnection sqlConn = new SqlConnection(ConnectionString))
            {
                sqlConn.Open();
                ExecuteSql(sqlConn, query);
                sqlConn.Close();
            }
        }
        public static void ExecuteSql(IDbConnection dbConn, string query)
        {
            var adoNetConn = ((IHasDbConnection)dbConn).DbConnection;
            var sqlConn = adoNetConn as SqlConnection;
            ExecuteSql(sqlConn, query);
        }

        public static void ExecuteSql(SqlConnection sqlConn, string query)
        {
            SqlCommand myCmd = new SqlCommand(query, sqlConn);
            myCmd.CommandType = System.Data.CommandType.Text;

            int num_affected_row = myCmd.ExecuteNonQuery();
        }
        #endregion

        #region ExecuteStoredProcudure
        public static void ExecuteStoredProcudure(string storedprocedure)
        {
            SqlConnection myCon = new SqlConnection(ConnectionString);
            SqlCommand myCmd = new SqlCommand(storedprocedure, myCon);
            myCmd.CommandType = System.Data.CommandType.StoredProcedure;

            //parameters
            myCmd.Parameters.Add("@p_Ten", System.Data.SqlDbType.NVarChar);
           
            //values
            myCmd.Parameters["@p_Ten"].Value = DBNull.Value;

            SqlParameter pIdOut = new SqlParameter("@p_Id_out", System.Data.SqlDbType.Int);
            pIdOut.Direction = ParameterDirection.Output;
            myCmd.Parameters.Add(pIdOut);

            //execute
            myCon.Open();
            myCmd.ExecuteNonQuery();
            //========================================
            //get outvalue
            string outvalue = pIdOut.Value.ToString();
        }
        #endregion
    }
}