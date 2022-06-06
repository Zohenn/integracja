using Backend.Entities;
using Backend.Models;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;

namespace Backend.Services
{
    public class GoldServiceImpl : UploadService<Gold>, IGoldService
    {
        public List<Gold> All()
        {
            using var db = new DatabaseContext();
            return db.Gold.ToList();
        }

        public override DbSet<Gold> GetDataSet(DatabaseContext db)
        {
            return db.Gold;
        }

        public List<Gold> GetDateRange(DateTime startDate, DateTime endDate)
        {
            using var db = new DatabaseContext();
            return db.Gold.Where(Gold => Gold.Date >= startDate && Gold.Date <= endDate).OrderBy(Gold => Gold.Date).ToList();
        }

        public ResourceInfo Info()
        {
            using var db = new DatabaseContext();
            var baseQuery = db.Gold.Select(entry => entry.Date);
            return new ResourceInfo("Gold", "$/ounce", baseQuery.Min(), baseQuery.Max());
        }
    }
}
