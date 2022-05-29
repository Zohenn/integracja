using System;
using System.ComponentModel.DataAnnotations;

namespace Backend.Entities
{
	public class Gold
	{
		
			[Key]
			public DateTime Date { get; set; }

			public float Price { get; set; }
	}
}
