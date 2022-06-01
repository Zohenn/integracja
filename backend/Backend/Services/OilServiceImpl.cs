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
            return ListOfOilsInMonths(db.Oil.ToList());
        }

        public List<Oil> GetDateRange(DateTime startDate, DateTime endDate)
        {
            using var db = new DatabaseContext();
            return ListOfOilsInMonths(db.Oil.Where(Oil => Oil.Date >= startDate && Oil.Date <= endDate).OrderBy(Oil => Oil.Date).ToList());
            
        }

        private List<Oil> ListOfOilsInMonths(List<Oil> listOfOil)
        {
            float sumOfPrices = 0;
            int sumOfDays = 0;
            List<Oil> listOfMonthsWithAverage = new List<Oil>();
            for (int i = 0; i < listOfOil.Count; i++)
            {
                sumOfPrices = sumOfPrices + listOfOil[i].Price;
                sumOfDays = sumOfDays + 1;
                if (i == listOfOil.Count - 1 || listOfOil[i].Date.Month != listOfOil[i + 1].Date.Month)
                {
                    Oil oil = new();
                    oil.Price = sumOfPrices / sumOfDays;
                    oil.Date = new DateTime(listOfOil[i].Date.Year, listOfOil[i].Date.Month, 1);
                    listOfMonthsWithAverage.Add(oil);
                    sumOfPrices = 0;
                    sumOfDays = 0;
                }
            }
            return listOfMonthsWithAverage;
        }

        public ResourceInfo Info()
        {
            using var db = new DatabaseContext();
            var baseQuery = db.Oil.Select(entry => entry.Date);
            return new ResourceInfo("Oil", "$/barrel", baseQuery.Min(), baseQuery.Max());
        }
    }
}
