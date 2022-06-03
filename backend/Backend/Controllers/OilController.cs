using Backend.Services;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System;

namespace Backend.Controllers
{
    [Route("api/rest/{controller}")]
    [ApiController]
    [Authorize(Roles = "user,admin", AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
    public class OilController : ControllerBase
    {
        private readonly IOilService service;

        public OilController()
        {
            service = new OilServiceImpl();
        }

        [HttpGet("")]
        public IActionResult All()
        {
            return Ok(service.All());
        }

        [HttpGet("date-range")]
        public IActionResult DateRange(DateTime? startDate, DateTime? endDate)
        {
            if (startDate == null || endDate == null || endDate < startDate)
            {
                return BadRequest();
            }
            return Ok(service.GetDateRange((DateTime)startDate, (DateTime)endDate));
        }

        [HttpGet("info")]
        public IActionResult Info()
        {
            return Ok(service.Info());
        }
    }
}
