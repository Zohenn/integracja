using Backend.Entities;
using Backend.Models;
using System;
using System.Collections.Generic;
using System.Linq;

namespace Backend.Services
{
    public class GrainServiceImpl : IGrainService
    {
        public List<Grain> All()
        {
            using var db = new DatabaseContext();
            return db.Grain.ToList();
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
            return new ResourceInfo("Grains", baseQuery.Min(), baseQuery.Max());
        }
    }
}
