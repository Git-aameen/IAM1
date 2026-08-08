using IAM1.Server.Models;
using Microsoft.EntityFrameworkCore;

namespace IAM1.Server.Data
{
    // ต้องสืบทอด (inherit) มาจาก DbContext เสมอ
    public class ApplicationDbContext : DbContext
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
            : base(options)
        {
        }

        public DbSet<UserProfiles> UserProfiles { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // Seed Data 
            modelBuilder.Entity<UserProfiles>().HasData(new UserProfiles
            {
                Id = 1,
                FullName = "Dracule Mihawk",
                EmployeeId = "EMP-2024-0089",
                Gender = "Male",
                DateOfBirth = new DateTime(1992, 5, 14),
                Email = "johnathan.s@company.com",
                Phone = "+66 81 234 5678",
                OfficeLocation = "Headquarter, Floor 12, Tech Tower",
                Department = "Information Technology",
                Position = "Senior System Administrator",
                ManagerID = "Sarah Jenkins (IT Director)",
                ManagerEmail = "Sarah.Jenkins@company.com",
                JoinedDate = new DateTime(2021, 1, 15),
                EmployeeStatus = "Active",
                EmployeeType = "Permanent"
            });
        }
    }
}