using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace PCPartPicker.Models
{
    public class IdentityContext : IdentityDbContext
    {
        public IdentityContext(DbContextOptions<IdentityContext> options) : base(options)
        {

        }
        public DbSet<AppUser> AppUsers { get; set; }
    }
}
