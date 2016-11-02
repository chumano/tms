using System;
using System.Collections.Generic;
using System.Dynamic;
using System.Linq;
using System.Reflection;
using System.Web;

namespace Common
{
    public static class ExtensionHelper
    {
        public static T ToEnum<T>(this string value)
        {
            return (T)Enum.Parse(typeof(T), value, true);
        }

        public static dynamic ToDymanicObject<T>(this T record)
        {
            dynamic newRecord = new ExpandoObject();

            IDictionary<string, object> myUnderlyingObject = newRecord;
            //Get Properties
            var properties = record.GetType().GetProperties();
            var column = 0;
            foreach (PropertyInfo property in properties)
            {
                //If property is generic list, continue
                //if (property.PropertyType.IsGenericType && property.PropertyType.GetGenericTypeDefinition() == typeof(List<>)) continue;

                //Check for dbnull, return null if true, or convert to correct type
                var columnValue = property.GetValue(record);

                //Set property for newRecord
                //newRecord[property.Name] = columnValue;
                myUnderlyingObject.Add(property.Name, columnValue);
                column++;
            }
            return newRecord;
        }
    }
}