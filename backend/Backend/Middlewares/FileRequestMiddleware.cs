using Microsoft.AspNetCore.Http;
using System;
using System.IO.MemoryMappedFiles;
using System.Threading.Tasks;

namespace Backend.Middlewares
{
    public class FileRequestMiddleware
    {
        private readonly RequestDelegate _next;

        public FileRequestMiddleware(RequestDelegate next)
        {
            _next = next;
        }

        public Task Invoke(HttpContext httpContext)
        {
            var request = httpContext.Request;
            var response = httpContext.Response;
            if (request.Query.ContainsKey("format"))
            {
                var format = request.Query["format"];
                response.Headers.Add("Content-Disposition", $"attachment; filename=data.{format}");
            }
            return _next(httpContext);
        }
    }
}
