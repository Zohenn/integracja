using Backend.Entities;
using Backend.Services;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.IO;

namespace Backend.Controllers
{
    [Route("api/rest/[controller]")]
    [ApiController]
    [Authorize(Roles = "user,admin", AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
    public class ConflictsController : UploadController<Conflict>
    {
        protected readonly ConflictServiceImpl service;

        protected override UploadService<Conflict> Service { get => service; }

        public ConflictsController()
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
