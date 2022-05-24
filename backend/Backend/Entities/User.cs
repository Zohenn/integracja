using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace Backend.Entities
{
    public class User
    {
        public int Id { get; set; }
        public string Username { get; set; }

        [JsonIgnore]
        public string Password { get; set; }
        public List<Role> Roles { get; set; }
    }
}
