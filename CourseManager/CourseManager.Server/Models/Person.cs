using Microsoft.EntityFrameworkCore;
using System.ComponentModel.DataAnnotations;

namespace CourseManager.Server.Models
{
    [Index(nameof(FullName))]
    public class Person
    {
        public int PersonId { get; set; }

        [Required]
        [MaxLength(200)]
        public string FullName { get; set; } = null!;

        public int UserId { get; set; }
        public AppUser User { get; set; } = null!;

        public ICollection<CoursePerson> CoursePeople { get; set; } = new List<CoursePerson>();
        public ICollection<CourseSectionPerson> CourseSectionPeople { get; set; } = new List<CourseSectionPerson>();
        public ICollection<GroupPerson> GroupPeople { get; set; } = new List<GroupPerson>();
        public ICollection<PersonFile> PersonFiles { get; set; } = new List<PersonFile>();
    }
}
