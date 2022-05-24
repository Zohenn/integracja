using System;
using System.ComponentModel.DataAnnotations;

namespace Backend.Entities
{
    public class Conflict
    {
        [Key]
        public long Id { get; set; }

        public DateTime Date { get; set; }

        public string Name { get; set; }
    }
}
