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
        public DbSet<FileAsset> Files { get; set; }

        public DbSet<CoursePerson> CoursePeople { get; set; }
        public DbSet<CourseSectionPerson> CourseSectionPeople { get; set; }
        public DbSet<GroupPerson> GroupPeople { get; set; }

        public DbSet<CourseFile> CourseFiles { get; set; }
        public DbSet<CourseSectionFile> CourseSectionFiles { get; set; }
        public DbSet<GroupFile> GroupFiles { get; set; }
        public DbSet<PersonFile> PersonFiles { get; set; }


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
                .HasKey(cep => new { cep.CourseSectionId, cep.PersonId });

            modelBuilder.Entity<CourseSectionPerson>()
                .HasOne(cep => cep.CourseSection)
                .WithMany(ce => ce.CourseSectionPeople)
                .HasForeignKey(cep => cep.CourseSectionId)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<CourseSectionPerson>()
                .HasOne(cep => cep.Person)
                .WithMany(p => p.CourseSectionPeople)
                .HasForeignKey(cep => cep.PersonId)
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
                .HasKey(cef => new { cef.CourseSectionId, cef.FileAssetId });

            modelBuilder.Entity<CourseSectionFile>()
                .HasOne(cef => cef.CourseSection)
                .WithMany(ce => ce.CourseSectionFiles)
                .HasForeignKey(cef => cef.CourseSectionId)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<CourseSectionFile>()
                .HasOne(cef => cef.FileAsset)
                .WithMany(f => f.CourseSectionFiles)
                .HasForeignKey(cef => cef.FileAssetId)
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
                .HasOne(ce => ce.Course)
                .WithMany(c => c.CourseSections)
                .HasForeignKey(ce => ce.CourseId)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<Group>()
                .HasOne(g => g.CourseSection)
                .WithMany(ce => ce.Groups)
                .HasForeignKey(g => g.CourseSectionId)
                .OnDelete(DeleteBehavior.Cascade);
        }
    }
}
