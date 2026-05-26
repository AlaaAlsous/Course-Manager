using Microsoft.EntityFrameworkCore;
using System.ComponentModel.DataAnnotations;

namespace CourseManager.Server.Models
{
    [Index(nameof(Name), IsUnique = true)]
    public class Course
    {
        public int CourseId { get; set; }

        [Required]
        [MaxLength(200)]
        public string Name { get; set; } = null!;

        [MaxLength(2000)]
        public string? Description { get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        public ICollection<CourseEvent> CourseEvents { get; set; } = new List<CourseEvent>();
        public ICollection<CoursePerson> CoursePeople { get; set; } = new List<CoursePerson>();
        public ICollection<CourseFile> CourseFiles { get; set; } = new List<CourseFile>();
    }
}
