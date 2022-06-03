using Backend.Entities;
using Backend.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Security.Claims;
using System.Text;

namespace Backend.Services.Users
{
    public class UserServiceImpl : IUserService
    {

        private IConfiguration configuration;

        public UserServiceImpl(IConfiguration configuration)
        {
            this.configuration = configuration;
        }

        public AuthenticationResponse Authenticate(AuthenticationRequest request)
        {
            using var db = new DatabaseContext();
            User user = GetByUsername(request.Username);
            if (user == null || user.Password != request.Password)
            {
                return null;
            }
            string token = generateJwtToken(user);
            return new AuthenticationResponse(user, token);
        }

        public User GetById(int id)
        {
            //return users.FirstOrDefault(x => x.Id == id);
            using var db = new DatabaseContext();
            return db.User.Where(user => user.Id == id).FirstOrDefault();
        }

        public User GetByUsername(string username)
        {
            using var db = new DatabaseContext();
            return db.User.Select(user => user).Include(user => user.Role).FirstOrDefault(user => user.Username == username);
        }

        public List<User> GetUsers()
        {
            using var db = new DatabaseContext();
            return db.User.ToList();
        }

        public string generateJwtToken(User user)
        {
            var tokenHandler = new JwtSecurityTokenHandler();
            var key = Encoding.ASCII.GetBytes(configuration["Jwt:key"]);
            var claims = new List<Claim>();
            claims.Add(new Claim("id", user.Id.ToString()));
            claims.Add(new Claim(ClaimTypes.Role, user.Role.Name.ToString()));

            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(claims.ToArray()),
                Expires = DateTime.UtcNow.AddHours(1),
                SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256Signature)
            };
            var token = tokenHandler.CreateToken(tokenDescriptor);

            return tokenHandler.WriteToken(token);
        }
    }
}
