namespace CourseManager.Server.DTOs;

public record CourseDto(
    int CourseId,
    string Name,
    string? Description,
    DateTime CreatedAt
);

public record CreateCourseRequest(
    string Name,
    string? Description
);

public record UpdateCourseRequest(
    string Name,
    string? Description
);
