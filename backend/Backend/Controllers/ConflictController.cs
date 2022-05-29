using Backend.Services;
using Microsoft.AspNetCore.Mvc;
using System;

namespace Backend.Controllers
{
    [Route("api/rest/[controller]")]
    [ApiController]
    public class ConflictController: ControllerBase
    {
        private readonly IConflictService service;

        public ConflictController()
        {
            service = new ConflictServiceImpl();
        }

        [HttpGet("")]
        public IActionResult All()
        {
            return Ok(service.All());
        }

        [HttpGet("{id}")]
        public IActionResult Id(int id)
        {
            return Ok(service.GetById(id));
        }

        [HttpGet("date-range")]
        public IActionResult DateRange(DateTime? startDate, DateTime? endDate)
        {
            if(startDate == null || endDate == null || endDate < startDate)
            {
                return BadRequest();
            }
            return Ok(service.GetDateRange((DateTime)startDate, (DateTime)endDate));
        }
    }
}
