public static class ApiEndpoints
{
    public static IEndpointRouteBuilder MapEndpoints(this IEndpointRouteBuilder routes)
    {

        var group = routes.MapGroup("/api/group");

        group.MapGet("/", () => Results.StatusCode(501));
        group.MapGet("/{id:int}", () => Results.StatusCode(501));
        group.MapPost("/", () => Results.StatusCode(501));
        group.MapPut("/{id:int}", () => Results.StatusCode(501));
        group.MapDelete("/{id:int}", () => Results.StatusCode(501));

        var person = routes.MapGroup("/api/person");

        person.MapGet("/", () => Results.StatusCode(501));
        person.MapGet("/{id:int}", () => Results.StatusCode(501));
        person.MapPost("/", () => Results.StatusCode(501));
        person.MapPut("/{id:int}", () => Results.StatusCode(501));
        person.MapDelete("/{id:int}", () => Results.StatusCode(501));

        var course = routes.MapGroup("/api/course");

        course.MapGet("/", () => Results.StatusCode(501));
        course.MapGet("/{id:int}", () => Results.StatusCode(501));
        course.MapPost("/", () => Results.StatusCode(501));
        course.MapPut("/{id:int}", () => Results.StatusCode(501));
        course.MapDelete("/{id:int}", () => Results.StatusCode(501));

        var section = routes.MapGroup("/api/course-section");

        section.MapGet("/", () => Results.StatusCode(501));
        section.MapGet("/{id:int}", () => Results.StatusCode(501));
        section.MapPost("/", () => Results.StatusCode(501));
        section.MapPut("/{id:int}", () => Results.StatusCode(501));
        section.MapDelete("/{id:int}", () => Results.StatusCode(501));

        var files = routes.MapGroup("/api/files");

        files.MapGet("/", () => Results.StatusCode(501));
        files.MapGet("/{fileId:int}", () => Results.StatusCode(501));
        files.MapPost("/", () => Results.StatusCode(501));
        files.MapDelete("/{fileId:int}", () => Results.StatusCode(501));

        files.MapGet("/course/{id:int}", () => Results.StatusCode(501));
        files.MapGet("/course-section/{id:int}", () => Results.StatusCode(501));
        files.MapGet("/group/{id:int}", () => Results.StatusCode(501));
        files.MapGet("/person/{id:int}", () => Results.StatusCode(501));

        return routes;
    }
}
