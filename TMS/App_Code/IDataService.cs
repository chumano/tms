using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Web;

namespace CHUNOApp.App_Code
{
    public interface IDataService
    {
        Dictionary<string, object> Login(string LoginId, string Password);

        DataTable GetDataFromConfiguration(int userId, DataConfig config);
        IList<Dictionary<string, object>> GetDataFromConfigurationJsonable(int userId, DataConfig config);
        int CountDataFromConfiguration(int userId, DataConfig config);
        Dictionary<string, object> SumDataFromConfiguration(int userId, DataConfig config);

        Dictionary<string, object> GetObject(int userId, string tableName, string columName, string columValue);
        int SaveObject(int userId, string tableName, string objectData);
        int SaveComplexObject(int userId, string tableName, string objectData, string subTableName, string subObjectData);
        void SaveListObject(int userId, string tableName, string objectData);
        void DeleteObject(int userId, string tableName, int keyValue, bool isHardDelete);
        bool CheckCanCreate(int userId, string tableName);
        bool CheckField(int userId, string field);

        Dictionary<string, object> GetRules(int userId, DataConfig config);
    }
}