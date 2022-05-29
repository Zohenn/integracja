using System.ComponentModel.DataAnnotations;
using System;

namespace Backend.Entities
{
    public class Oil
    {
        [Key]
        public DateTime Date { get; set; }

        public float Price { get; set; }
    }
}
