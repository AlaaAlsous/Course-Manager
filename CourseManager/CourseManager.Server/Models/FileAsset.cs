using Microsoft.EntityFrameworkCore;
using System.ComponentModel.DataAnnotations;

namespace CourseManager.Server.Models
{
    [Index(nameof(FileName))]
    public class FileAsset
    {
        public int FileAssetId { get; set; }

        [Required]
        [MaxLength(255)]
        public string FileName { get; set; } = null!;

        public string? LocalPath { get; set; }

        public string? CloudPath { get; set; }

        [Required]
        [MaxLength(20)]
        public string StorageProvider { get; set; } = "local";

        [Required]
        [MaxLength(50)]
        public string FileType { get; set; } = null!;

        public long FileSize { get; set; }

        public DateTime UploadedAt { get; set; } = DateTime.UtcNow;

        public ICollection<CourseFile> CourseFiles { get; set; } = new List<CourseFile>();
        public ICollection<CourseSectionFile> CourseSectionFiles { get; set; } = new List<CourseSectionFile>();
        public ICollection<GroupFile> GroupFiles { get; set; } = new List<GroupFile>();
        public ICollection<PersonFile> PersonFiles { get; set; } = new List<PersonFile>();
    }
}
