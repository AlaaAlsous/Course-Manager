using Microsoft.EntityFrameworkCore;
using System.ComponentModel.DataAnnotations;

namespace CourseManager.Server.Models
{
    [Index(nameof(Name))]
    public class Course
    {
        public int CourseId { get; set; }

        [Required]
        [MaxLength(200)]
        public string Name { get; set; } = null!;

        [MaxLength(2000)]
        public string? Description { get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        public int UserId { get; set; }
        public AppUser User { get; set; } = null!;

        public ICollection<CourseSection> CourseSections { get; set; } = new List<CourseSection>();
        public ICollection<CoursePerson> CoursePeople { get; set; } = new List<CoursePerson>();
        public ICollection<CourseFile> CourseFiles { get; set; } = new List<CourseFile>();
    }
}
