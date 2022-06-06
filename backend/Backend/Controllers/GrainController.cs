using System;
using Microsoft.AspNetCore.Mvc;
using Backend.Services;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Backend.Entities;

namespace Backend.Controllers
{
    [Route("api/rest/{controller}")]
    [ApiController]
    [Authorize(Roles = "user,admin", AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
    public class GrainController : UploadController<Grain>
    {
        private readonly GrainServiceImpl service;

        public GrainController()
        {
            service = new GrainServiceImpl();
        }

        protected override UploadService<Grain> Service => service;

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
