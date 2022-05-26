using System;
using System.ComponentModel.DataAnnotations;

namespace Backend.Entities
{
    public class NaturalGas
    {
        [Key]
        public DateTime Date { get; set; }

        public float Price { get; set; }
    }
}
