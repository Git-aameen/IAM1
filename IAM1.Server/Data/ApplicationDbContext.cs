using IAM1.Server.Models;
using Microsoft.EntityFrameworkCore;

namespace IAM1.Server.Data
{
    public class ApplicationDbContext : DbContext
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
            : base(options)
        {
        }

        public DbSet<UserProfiles> UserProfiles { get; set; }

        public DbSet<UserLogin> UserLogin { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.Entity<UserLogin>()
                .HasIndex(x => x.Username)
                .IsUnique();

            modelBuilder.Entity<UserLogin>()
                .HasIndex(x => x.UserProfileId)
                .IsUnique();

            modelBuilder.Entity<UserLogin>()
                .HasOne(x => x.UserProfile)
                .WithOne()
                .HasForeignKey<UserLogin>(x => x.UserProfileId)
                .OnDelete(DeleteBehavior.Cascade);
        }
    }
}