using System.ComponentModel.DataAnnotations;
using System;

namespace Backend.Entities
{
    public class Grain
    {
        [Key]
        public DateTime Date { get; set; }

        public float Wheat { get; set; }

        public float Corn { get; set; }

        public float Rice { get; set; }
    }
}
