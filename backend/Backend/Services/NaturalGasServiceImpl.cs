using Backend.Entities;
using Backend.Models;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;

namespace Backend.Services
{
    public class NaturalGasServiceImpl : UploadService<NaturalGas>, INaturalGasService
    {
        public List<NaturalGas> All()
        {
            using var db = new DatabaseContext();
            return db.NaturalGas.ToList();
        }

        public override DbSet<NaturalGas> GetDataSet(DatabaseContext db)
        {
            return db.NaturalGas;
        }

        public List<NaturalGas> GetDateRange(DateTime startDate, DateTime endDate)
        {
            using var db = new DatabaseContext();
            return db.NaturalGas.Where(naturalGas => naturalGas.Date >= startDate && naturalGas.Date <= endDate).OrderBy(naturalGas => naturalGas.Date).ToList();
        }

        public ResourceInfo Info()
        {
            using var db = new DatabaseContext();
            var baseQuery = db.NaturalGas.Select(entry => entry.Date);
            return new ResourceInfo("Natural gas", "$/MMBtu", baseQuery.Min(), baseQuery.Max());
        }
    }
}
