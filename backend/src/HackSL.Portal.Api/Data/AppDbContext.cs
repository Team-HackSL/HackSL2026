using HackSL.Portal.Api.Models;
using Microsoft.EntityFrameworkCore;

namespace HackSL.Portal.Api.Data;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

    public DbSet<User> Users => Set<User>();
    public DbSet<UserProfile> Profiles => Set<UserProfile>();
    public DbSet<SkillRating> SkillRatings => Set<SkillRating>();

    protected override void OnModelCreating(ModelBuilder b)
    {
        b.Entity<User>(e =>
        {
            e.Property(u => u.Id).ValueGeneratedNever();
            e.Property(u => u.Email).HasMaxLength(256).IsRequired();
            e.HasIndex(u => u.Email).IsUnique();
            e.Property(u => u.PasswordHash).IsRequired();

            e.HasOne(u => u.Profile)
                .WithOne(p => p.User)
                .HasForeignKey<UserProfile>(p => p.UserId)
                .OnDelete(DeleteBehavior.Cascade);
        });

        b.Entity<UserProfile>(e =>
        {
            e.Property(p => p.Id).ValueGeneratedNever();
            e.Property(p => p.FullName).HasMaxLength(200).IsRequired();
            e.Property(p => p.Institution).HasMaxLength(200);
            e.Property(p => p.Description).HasMaxLength(4000);
            e.Property(p => p.LinkedInUrl).HasMaxLength(500);
            e.Property(p => p.GitHubUrl).HasMaxLength(500);
            e.Property(p => p.ResumeUrl).HasMaxLength(1000);
            e.Property(p => p.ResumeFileName).HasMaxLength(300);
            e.Property(p => p.ProfilePhotoUrl).HasMaxLength(1000);

            e.HasMany(p => p.Skills)
                .WithOne(s => s.Profile)
                .HasForeignKey(s => s.ProfileId)
                .OnDelete(DeleteBehavior.Cascade);
        });

        b.Entity<SkillRating>(e =>
        {
            e.Property(s => s.Id).ValueGeneratedNever();
            e.Property(s => s.Category).HasMaxLength(100).IsRequired();
        });
    }
}
