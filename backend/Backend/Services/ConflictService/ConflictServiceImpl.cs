using Backend.Entities;
using System;
using System.Collections.Generic;
using System.Linq;

namespace Backend.Services.ConflictService
{
    public class ConflictServiceImpl : IConflictService
    {
        public List<Conflict> All()
        {
            using var db = new DatabaseContext();
            return db.Conflicts.OrderBy(conflict => conflict.Date).ToList();
        }

        public Conflict? GetById(int id)
        {
            using var db = new DatabaseContext();
            return db.Conflicts.Where(conflict => conflict.Id == id).FirstOrDefault();
        }

        public List<Conflict> GetDateRange(DateTime startDate, DateTime endDate)
        {
            using var db = new DatabaseContext();
            return db.Conflicts.Where(conflict => conflict.Date >= startDate && conflict.Date <= endDate).OrderBy(conflict => conflict.Date).ToList();
        }
    }
}
