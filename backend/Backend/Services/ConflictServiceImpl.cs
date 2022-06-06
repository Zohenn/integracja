using Backend.Entities;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;

namespace Backend.Services
{
    public class ConflictServiceImpl : UploadService<Conflict>, IConflictService
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

        public override DbSet<Conflict> GetDataSet(DatabaseContext db)
        {
            return db.Conflicts;
        }

        public List<Conflict> GetDateRange(DateTime startDate, DateTime endDate)
        {
            using var db = new DatabaseContext();
            return db.Conflicts.Where(conflict => conflict.Date >= startDate && conflict.Date <= endDate).OrderBy(conflict => conflict.Date).ToList();
        }
    }
}
