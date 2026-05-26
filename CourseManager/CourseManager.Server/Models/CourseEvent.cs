using System.ComponentModel.DataAnnotations;

namespace CourseManager.Server.Models
{
    public class CourseEvent
    {
        public int CourseEventId { get; set; }

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
        public ICollection<CourseEventPerson> CourseEventPeople { get; set; } = new List<CourseEventPerson>();
        public ICollection<CourseEventFile> CourseEventFiles { get; set; } = new List<CourseEventFile>();
    }
}
