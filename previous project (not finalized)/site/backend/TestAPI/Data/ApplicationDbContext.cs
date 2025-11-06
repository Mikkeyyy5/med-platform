using Microsoft.EntityFrameworkCore;
using TestAPI.Models;

namespace TestAPI.Data
{
    public class MedicalDbContext : DbContext
    {
        public MedicalDbContext(DbContextOptions<MedicalDbContext> options) : base(options) { }

        public DbSet<User> Users { get; set; }
        public DbSet<Appeal> Appeals { get; set; }
        public DbSet<Doctor> Doctors { get; set; }
        public DbSet<Appointment> Appointments { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<User>()
                .HasIndex(u => u.Email)
                .IsUnique();

            modelBuilder.Entity<Appeal>()
                .HasOne(a => a.User)
                .WithMany(u => u.Appeals)
                .HasForeignKey(a => a.UserId);

            modelBuilder.Entity<Appeal>()
                .HasOne(a => a.AssignedDoctor)
                .WithMany(d => d.Appeals)
                .HasForeignKey(a => a.AssignedDoctorId);

            modelBuilder.Entity<Appointment>()
                .HasOne(a => a.User)
                .WithMany(u => u.Appointments)
                .HasForeignKey(a => a.UserId);

            modelBuilder.Entity<Appointment>()
                .HasOne(a => a.Doctor)
                .WithMany(d => d.Appointments)
                .HasForeignKey(a => a.DoctorId);
        }
    }
}
