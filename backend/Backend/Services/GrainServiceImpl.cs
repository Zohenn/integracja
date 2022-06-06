using Backend.Entities;
using Backend.Models;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;

namespace Backend.Services
{
    public class GrainServiceImpl : UploadService<Grain>, IGrainService
    {
        public List<Grain> All()
        {
            using var db = new DatabaseContext();
            return db.Grain.ToList();
        }

        public override DbSet<Grain> GetDataSet(DatabaseContext db)
        {
            return db.Grain;
        }

        public List<Grain> GetDateRange(DateTime startDate, DateTime endDate)
        {
            using var db = new DatabaseContext();
            return db.Grain.Where(Grain => Grain.Date >= startDate && Grain.Date <= endDate).OrderBy(Grain => Grain.Date).ToList();
        }

        public ResourceInfo Info()
        {
            using var db = new DatabaseContext();
            var baseQuery = db.Grain.Select(entry => entry.Date);
            return new ResourceInfo("Grains", "$/ton", baseQuery.Min(), baseQuery.Max(), new Dictionary<string, string>()
            {
                { "wheat", "Wheat" },
                { "rice", "Rice" },
                { "corn", "Corn" },
            });
        }
    }
}
