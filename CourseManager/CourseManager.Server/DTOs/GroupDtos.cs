namespace CourseManager.Server.DTOs;

public record GroupDto(
    int GroupId,
    string Name,
    int CourseSectionId
);

public record CreateGroupRequest(
    string Name,
    int CourseSectionId
);

public record UpdateGroupRequest(
    string Name
);
