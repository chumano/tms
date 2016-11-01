using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace CHUNOApp.App_Code
{
    public class DataConfig
    {
        public const string TableType = "table";
        public const string FunctionType = "function";

        #region Data Config
        public string type { get; set; }
        public string functionparameters { get; set; }

        public string dataobject { get; set; }
        public int numdata { get; set; }

        public string columns { get; set; }
        public string sort { get; set; }
        public string condition { get; set; }

        public string action { get; set; } //getall/get/get10/sum/count/excel
        public int startrow { get; set; }
        public int endrow { get; set; }
        #endregion
    }

  
}