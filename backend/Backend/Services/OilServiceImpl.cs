using Backend.Entities;
using Backend.Models;
using System;
using System.Collections.Generic;
using System.Linq;

namespace Backend.Services
{
    public class OilServiceImpl : IOilService
    {
        public List<Oil> All()
        {
            using var db = new DatabaseContext();
            return db.Oil.ToList();
        }

        public List<Oil> GetDateRange(DateTime startDate, DateTime endDate)
        {
            using var db = new DatabaseContext();
            return db.Oil.Where(Oil => Oil.Date >= startDate && Oil.Date <= endDate).OrderBy(Oil => Oil.Date).ToList();
            
        }

        public ResourceInfo Info()
        {
            using var db = new DatabaseContext();
            var baseQuery = db.Oil.Select(entry => entry.Date);
            return new ResourceInfo("Oil", "$/barrel", baseQuery.Min(), baseQuery.Max());
        }
    }
}
