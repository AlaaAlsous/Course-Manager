using Microsoft.EntityFrameworkCore;
using CourseManager.Server.Models;

namespace CourseManager.Server.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options)
            : base(options) { }

        public DbSet<Course> Courses { get; set; }
        public DbSet<CourseSection> CourseSections { get; set; }
        public DbSet<Group> Groups { get; set; }
        public DbSet<Person> People { get; set; }
        public DbSet<AppUser> AppUsers { get; set; }
        public DbSet<FileAsset> FileAssets { get; set; }
        public DbSet<CourseFile> CourseFiles { get; set; }
        public DbSet<CourseSectionFile> CourseSectionFiles { get; set; }
        public DbSet<GroupFile> GroupFiles { get; set; }
        public DbSet<PersonFile> PersonFiles { get; set; }

        public DbSet<CoursePerson> CoursePeople { get; set; }
        public DbSet<CourseSectionPerson> CourseSectionPeople { get; set; }
        public DbSet<GroupPerson> GroupPeople { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.Entity<CoursePerson>()
                .HasKey(cp => new { cp.CourseId, cp.PersonId });

            modelBuilder.Entity<CoursePerson>()
                .HasOne(cp => cp.Course)
                .WithMany(c => c.CoursePeople)
                .HasForeignKey(cp => cp.CourseId)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<CoursePerson>()
                .HasOne(cp => cp.Person)
                .WithMany(p => p.CoursePeople)
                .HasForeignKey(cp => cp.PersonId)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<CourseSectionPerson>()
                .HasKey(csp => new { csp.CourseSectionId, csp.PersonId });

            modelBuilder.Entity<CourseSectionPerson>()
                .HasOne(csp => csp.CourseSection)
                .WithMany(cs => cs.CourseSectionPeople)
                .HasForeignKey(csp => csp.CourseSectionId)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<CourseSectionPerson>()
                .HasOne(csp => csp.Person)
                .WithMany(p => p.CourseSectionPeople)
                .HasForeignKey(csp => csp.PersonId)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<GroupPerson>()
                .HasKey(gp => new { gp.GroupId, gp.PersonId });

            modelBuilder.Entity<GroupPerson>()
                .HasOne(gp => gp.Group)
                .WithMany(g => g.GroupPeople)
                .HasForeignKey(gp => gp.GroupId)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<GroupPerson>()
                .HasOne(gp => gp.Person)
                .WithMany(p => p.GroupPeople)
                .HasForeignKey(gp => gp.PersonId)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<CourseFile>()
                .HasKey(cf => new { cf.CourseId, cf.FileAssetId });

            modelBuilder.Entity<CourseFile>()
                .HasOne(cf => cf.Course)
                .WithMany(c => c.CourseFiles)
                .HasForeignKey(cf => cf.CourseId)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<CourseFile>()
                .HasOne(cf => cf.FileAsset)
                .WithMany(f => f.CourseFiles)
                .HasForeignKey(cf => cf.FileAssetId)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<CourseSectionFile>()
                .HasKey(csf => new { csf.CourseSectionId, csf.FileAssetId });

            modelBuilder.Entity<CourseSectionFile>()
                .HasOne(csf => csf.CourseSection)
                .WithMany(cs => cs.CourseSectionFiles)
                .HasForeignKey(csf => csf.CourseSectionId)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<CourseSectionFile>()
                .HasOne(csf => csf.FileAsset)
                .WithMany(f => f.CourseSectionFiles)
                .HasForeignKey(csf => csf.FileAssetId)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<GroupFile>()
                .HasKey(gf => new { gf.GroupId, gf.FileAssetId });

            modelBuilder.Entity<GroupFile>()
                .HasOne(gf => gf.Group)
                .WithMany(g => g.GroupFiles)
                .HasForeignKey(gf => gf.GroupId)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<GroupFile>()
                .HasOne(gf => gf.FileAsset)
                .WithMany(f => f.GroupFiles)
                .HasForeignKey(gf => gf.FileAssetId)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<PersonFile>()
                .HasKey(pf => new { pf.PersonId, pf.FileAssetId });

            modelBuilder.Entity<PersonFile>()
                .HasOne(pf => pf.Person)
                .WithMany(p => p.PersonFiles)
                .HasForeignKey(pf => pf.PersonId)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<PersonFile>()
                .HasOne(pf => pf.FileAsset)
                .WithMany(f => f.PersonFiles)
                .HasForeignKey(pf => pf.FileAssetId)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<CourseSection>()
                .HasOne(cs => cs.Course)
                .WithMany(c => c.CourseSections)
                .HasForeignKey(cs => cs.CourseId)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<Group>()
                .HasOne(g => g.CourseSection)
                .WithMany(cs => cs.Groups)
                .HasForeignKey(g => g.CourseSectionId)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<AppUser>()
                .HasIndex(u => u.Username)
                .IsUnique();

            modelBuilder.Entity<Course>()
                .HasOne(c => c.User)
                .WithMany()
                .HasForeignKey(c => c.UserId)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<Person>()
                .HasOne(p => p.User)
                .WithMany()
                .HasForeignKey(p => p.UserId)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<FileAsset>()
                .HasOne(f => f.User)
                .WithMany()
                .HasForeignKey(f => f.UserId)
                .OnDelete(DeleteBehavior.Cascade);
        }
    }
}
