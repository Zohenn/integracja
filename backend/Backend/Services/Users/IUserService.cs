using Backend.Entities;
using Backend.Models;
using System.Collections.Generic;

namespace Backend.Services.Users
{
    public interface IUserService
    {
        AuthenticationResponse Authenticate(AuthenticationRequest request);
        List<User> GetUsers();
        User GetByUsername(string username);
        User GetById(int id);
    }
}
