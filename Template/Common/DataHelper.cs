using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Common;

namespace Template.Common
{
    public class DataHelper
    {
        public static List<ColumnInfo> LoadColumnInfos(int tableid)
        {
            DataTable tblconfig = DBHelper.GetDataTable(string.Format(@"select * from 
                        T_TOOL_ConfigTable
                        WHere DBTableId= {0}", tableid
               ));

            List<ColumnInfo> columns = new List<ColumnInfo>();

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
                bool IsBaseTableColumn = (bool)row["IsBaseTableColumn"];

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
                col.IsBaseTableColumn = IsBaseTableColumn;

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
        

        public static int FindTableID(string tablename)
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
