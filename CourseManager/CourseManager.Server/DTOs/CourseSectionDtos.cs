namespace CourseManager.Server.DTOs;

public record CourseSectionDto(
    int CourseSectionId,
    string Name,
    string? Description,
    DateTime CreatedAt,
    DateTime? StartDate,
    DateTime? EndDate,
    int CourseId
);

public record CreateCourseSectionRequest(
    string Name,
    string? Description,
    DateTime? StartDate,
    DateTime? EndDate,
    int CourseId
);

public record UpdateCourseSectionRequest(
    string Name,
    string? Description,
    DateTime? StartDate,
    DateTime? EndDate
);
