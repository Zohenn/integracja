using Microsoft.EntityFrameworkCore;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.IO;
using System.Xml.Serialization;

namespace Backend.Services
{
    public abstract class UploadService<T> where T : class
    {
        public abstract DbSet<T> GetDataSet(DatabaseContext db);

        public List<T>? Upload(string data, string format)
        {
            List<T>? items;
            switch (format)
            {
                case "application/json":
                    items = JsonConvert.DeserializeObject<List<T>>(data);
                    break;
                case "application/xml":
                    var serializer = new XmlSerializer(typeof(List<T>));
                    using (var reader = new StringReader(data))
                    {
                        items = (List<T>?)serializer.Deserialize(reader);
                    }
                    break;
                default:
                    return null;
            }

            if (items != null)
            {
                using var db = new DatabaseContext();
                var table = GetDataSet(db);
                foreach (var item in items)
                {
                    table.Add(item);
                }
                db.SaveChanges();
            }
            return items;
        }
    }
}
