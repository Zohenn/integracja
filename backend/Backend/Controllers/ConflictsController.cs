using Backend.Services.ConflictService;
using Microsoft.AspNetCore.Mvc;
using System;

namespace Backend.Controllers
{
    [Route("api/rest/[controller]")]
    [ApiController]
    public class ConflictsController: ControllerBase
    {
        private readonly IConflictService conflictService;

        public ConflictsController()
        {
            conflictService = new ConflictServiceImpl();
        }

        [HttpGet("")]
        public IActionResult All()
        {
            return Ok(conflictService.All());
        }

        [HttpGet("{id}")]
        public IActionResult Id(int id)
        {
            return Ok(conflictService.GetById(id));
        }

        [HttpGet("date-range")]
        public IActionResult DateRange(DateTime? startDate, DateTime? endDate)
        {
            if(startDate == null || endDate == null || endDate > startDate)
            {
                return BadRequest();
            }
            return Ok(conflictService.GetDateRange((DateTime)startDate, (DateTime)endDate));
        }
    }
}
