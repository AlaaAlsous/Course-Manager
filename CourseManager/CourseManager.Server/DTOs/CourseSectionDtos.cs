namespace CourseManager.Server.DTOs;

public record CourseSectionDto(int Id, string Name, int CourseId);

public record CreateCourseSectionRequest(string Name, int CourseId);

public record UpdateCourseSectionRequest(string Name);
