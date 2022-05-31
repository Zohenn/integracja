using Microsoft.AspNetCore.Builder;

namespace Backend.Middlewares
{
    public static class FileRequestMiddlewareExtensions
    {
        public static IApplicationBuilder UseFileRequestMiddleware(this IApplicationBuilder builder)
        {
            return builder.UseMiddleware<FileRequestMiddleware>();
        }
    }
}
