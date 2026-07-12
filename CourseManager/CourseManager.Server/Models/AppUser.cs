using System.ComponentModel.DataAnnotations;

namespace CourseManager.Server.Models;

public class AppUser
{
    [Key]
    public int UserId { get; set; }

    [Required]
    [MaxLength(100)]
    public string Username { get; set; } = null!;

    [Required]
    public string PasswordHash { get; set; } = null!;

    [Required]
    [MaxLength(150)]
    public string DisplayName { get; set; } = null!;

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}