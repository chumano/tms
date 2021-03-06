﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Template
{
    public class TableInfo
    {
        public string TableName;
        public string Title;

        //thuộc tính bảng con
        public string RefColumn; //Column là trỏ tới Table Cha
        public bool IsOnlyOne = false;
        public bool IsBaseTableType = false;
        public string ChildType = ""; //ON_DETAIL_TAB / ON_MASTER

        public List<ColumnInfo> Columns;
    }

    #region ENUM

    public class EChildType
    {
        public static string ON_DETAIL_TAB = "ON_DETAIL_TAB";
        public static string ON_MASTER = "ON_MASTER";
    }
    #endregion

}