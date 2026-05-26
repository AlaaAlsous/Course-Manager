using System.ComponentModel.DataAnnotations;

namespace CourseManager.Server.Models
{
    public class Group
    {
        public int GroupId { get; set; }

        [Required]
        [MaxLength(200)]
        public string Name { get; set; } = null!;

        public int CourseEventId { get; set; }
        public CourseEvent CourseEvent { get; set; } = null!;

        public ICollection<GroupPerson> GroupPeople { get; set; } = new List<GroupPerson>();
        public ICollection<GroupFile> GroupFiles { get; set; } = new List<GroupFile>();
    }
}
