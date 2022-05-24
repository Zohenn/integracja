using Backend.Entities;
using Microsoft.EntityFrameworkCore;

namespace Backend.Services
{
    public class DatabaseContext: DbContext
    {
        public DbSet<Conflict> Conflicts { get; set; }

        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            optionsBuilder
                .UseMySQL("server=db;database=integracja;user=root;password=")
                .UseSnakeCaseNamingConvention();
        }
    }
}
