using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using CHUNOApp.Helpers;

namespace CHUNOApp.Template
{
    public class ColumnInfo
    {
        public string Name { get; set; }
        public string Type { get; set; }
        public string Title { get; set; }
        public string Description { get; set; }

        public bool IsNullable { get; set; }

        public bool IsForeignKey { get; set; }
        public string ForeignTable { get; set; }
        public string ForeignColumnKey { get; set; }
        public string ForeignColumnName { get; set; }
        public string ForeignKeyType { get; set; }
        public string ForeignKeyModal { get; set; }

        public bool IsYear { get; set; }
        public bool IsImage { get; set; }
        public bool IsFile { get; set; }
        public bool IsID { get; set; }

        //ui
        public bool IsView { get; set; }
        public bool IsFilter { get; set; }
        public string Position { get; set; }

        public ColumnInfo()
        {
            IsForeignKey = false;

            IsNullable = true;
            IsYear = false;
            IsFile = false;
            IsID = false;

            IsView = false;
            IsFilter = false;
            Position = EPosition.LEFT;
        }
        public ColumnInfo(string name, string type, bool isnull):this()
        {
            
            Name = name;
            Type = type;
            IsNullable = isnull;

            if (!isnull)
                IsView = true;
            else IsView = false;

            if (IsView)
            {
                if (Type == EType.BIT
                     ||Type == EType.DATETIME
                     ||Type == EType.INT
                     || Type == EType.NVARCHAR
                     || Type == EType.VARCHAR)
                {
                    IsFilter = true;
                }
            }
        }

        
    }
    #region ENUM
    public class EType { 
        public static string BIT ="BIT";
        public static string INT="INT";
        public static string  FLOAT="FLOAT";
        public static string VARCHAR ="VARCHAR";
        public static string  NVARCHAR="NVARCHAR";
        public static string NTEXT="NTEXT";
        public static string DATETIME = "DATETIME";
    }
    public class EForeignKeyType{ 
        public static string DROPDOWN = "DROPDOWN";
        public static string AUTOCOMPLETE="AUTOCOMPLETE";
        public static string SELECT_ON_MODAL="SELECT_ON_MODAL"; 
    }

    public class EForeignKeyModal { 
        public static string NONE = "NONE";
        public static string ON_FLY_MODAL = "ON_FLY_MODAL";
    }
    public class EPosition { 
        public static string LEFT ="LEFT";
        public static string RIGHT = "RIGHT";
    }
    #endregion
}