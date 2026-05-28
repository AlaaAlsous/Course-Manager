namespace CourseManager.Server.DTOs;

public record PersonDto(int PersonId, string FullName);

public record CreatePersonRequest(string FullName);

public record UpdatePersonRequest(string FullName);
