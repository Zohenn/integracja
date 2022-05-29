using System;
using System.Collections.Generic;

namespace Backend.Models
{
    public class ResourceInfo
    {

        public ResourceInfo(string name, string unit, DateTime minDate, DateTime maxDate, Dictionary<string, string>? subsets = null)
        {
            this.Name = name;
            this.Unit = unit;
            this.MinDate = minDate;
            this.MaxDate = maxDate;
            this.Subsets = subsets;
        }

        public string Name { get; set; }

        public string Unit { get; set; }

        public DateTime MinDate { get; set; }

        public DateTime MaxDate { get; set; }

        public Dictionary<string, string>? Subsets { get; set; }
    }
}
