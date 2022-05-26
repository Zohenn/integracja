using System;

namespace Backend.Models
{
    public class ResourceInfo
    {
        public string Name { get; set; }

        public ResourceInfo(string name, DateTime minDate, DateTime maxDate)
        {
            this.Name = name;
            this.MinDate = minDate;
            this.MaxDate = maxDate;
        }

        public DateTime MinDate { get; set; }

        public DateTime MaxDate { get; set; }
    }
}
