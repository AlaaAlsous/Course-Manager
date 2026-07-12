using System.ComponentModel.DataAnnotations;

namespace CourseManager.Server.DTOs;

public record LoginRequest(
    [Required] [MaxLength(100)] string Username,
    [Required] string Password
);

public record RegisterRequest(
    [Required] [MaxLength(100)] string Username,
    [Required] [MinLength(6)] [MaxLength(100)] string Password,
    [Required] [MaxLength(150)] string DisplayName
);

public record AuthResponse(
    string Token,
    int UserId,
    string Username,
    string DisplayName
);