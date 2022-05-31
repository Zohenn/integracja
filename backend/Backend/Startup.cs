using Backend.Middlewares;
using Backend.Services;
using Backend.Services.Users;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc.Formatters;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.IdentityModel.Tokens;
using SoapCore;
using System;
using System.Text;

namespace Backend
{
    public class Startup
    {
        public Startup(IConfiguration configuration)
        {
            this.Configuration = configuration;
        }
        public IConfiguration Configuration { get; }

        // This method gets called by the runtime. Use this method to add services to the container.
        // For more information on how to configure your application, visit https://go.microsoft.com/fwlink/?LinkID=398940
        public void ConfigureServices(IServiceCollection services)
        {
            services.AddSoapCore();
            services.AddCors();
            services.AddMvcCore().AddFormatterMappings().AddXmlSerializerFormatters();
            services.AddControllers(options =>
            {
                options.Filters.Add<FormatFilter>();
            });
            services.AddScoped<IUserService, UserServiceImpl>();
            services.AddScoped<IConflictService, ConflictServiceImpl>();
            services.AddScoped<INaturalGasService, NaturalGasServiceImpl>();
            services.AddScoped<IGoldService, GoldServiceImpl>();
            services.AddScoped<IGrainService, GrainServiceImpl>();
            services.AddScoped<IOilService, OilServiceImpl>();
            services.AddAuthentication(auth =>
            {
                auth.DefaultAuthenticateScheme =
               JwtBearerDefaults.AuthenticationScheme;
            })
            .AddJwtBearer(options =>
            {
                options.TokenValidationParameters = new TokenValidationParameters
                {
                    ValidateIssuer = false,
                    ValidateAudience = false,
                    ValidateLifetime = true,
                    ValidateIssuerSigningKey = true,
                    IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(Configuration["Jwt:Key"])),
                    ClockSkew = TimeSpan.Zero
                };
            });

        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
        {
            app.UseRouting();
            app.UseAuthentication();
            app.UseAuthorization();
            app.UseCors(x => x.AllowAnyOrigin().AllowAnyMethod().AllowAnyHeader());
            app.UseFileRequestMiddleware();
            app.UseEndpoints(endpoints =>
            {
                endpoints.MapControllers();
                endpoints.UseSoapEndpoint<IConflictService>("/api/soap/Conflict.asmx", new SoapEncoderOptions(), SoapSerializer.XmlSerializer);
                endpoints.UseSoapEndpoint<INaturalGasService>("/api/soap/NaturalGas.asmx", new SoapEncoderOptions(), SoapSerializer.XmlSerializer);
                endpoints.UseSoapEndpoint<IGoldService>("/api/soap/Gold.asmx", new SoapEncoderOptions(), SoapSerializer.XmlSerializer);
                endpoints.UseSoapEndpoint<IGrainService>("/api/soap/Grain.asmx", new SoapEncoderOptions(), SoapSerializer.XmlSerializer);
                endpoints.UseSoapEndpoint<IOilService>("/api/soap/Oil.asmx", new SoapEncoderOptions(), SoapSerializer.XmlSerializer);
            });
        }
    }
}
