using System.ComponentModel.DataAnnotations;

namespace CourseManager.Server.Models
{
    public class CourseSection
    {
        public int CourseSectionId { get; set; }

        [Required]
        [MaxLength(200)]
        public string Name { get; set; } = null!;

        [MaxLength(2000)]
        public string? Description { get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime? StartDate { get; set; }
        public DateTime? EndDate { get; set; }

        public int CourseId { get; set; }
        public Course Course { get; set; } = null!;

        public ICollection<Group> Groups { get; set; } = new List<Group>();
        public ICollection<CourseSectionPerson> CourseSectionPeople { get; set; } = new List<CourseSectionPerson>();
        public ICollection<CourseSectionFile> CourseSectionFiles { get; set; } = new List<CourseSectionFile>();
    }
}
