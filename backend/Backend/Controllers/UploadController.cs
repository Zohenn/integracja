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
    public abstract class UploadController<T> : ControllerBase where T : class
    {
        protected abstract UploadService<T> Service { get; }

        [HttpPost("upload")]
        [Authorize(Roles = "admin", AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
        public IActionResult Upload(List<IFormFile> file)
        {
            if (file.Count != 1)
            {
                return BadRequest();
            }

            string? stringContents;

            using (var reader = new StreamReader(file[0].OpenReadStream()))
            {
                stringContents = reader.ReadToEnd();
            }

            var items = Service.Upload(stringContents, file[0].ContentType);

            if (items == null)
            {
                return BadRequest();
            }

            return Ok(items.Count);
        }
    }
}
