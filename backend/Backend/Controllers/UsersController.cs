using Backend.Models;
using Backend.Services.Users;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Backend.Controllers
{
    [Route("api/rest/[controller]")]
    [ApiController]
    public class UsersController: ControllerBase
    {
        private IUserService userService;

        public UsersController(IUserService userService)
        {
            this.userService = userService;
        }

        [HttpPost("authenticate")]
        public IActionResult Authenticate(AuthenticationRequest request)
        {
            var response = userService.Authenticate(request);
            if (response == null)
                return BadRequest(new { message = "Username or password is incorrect"  });
            return Ok(response);
        }
    }
}
