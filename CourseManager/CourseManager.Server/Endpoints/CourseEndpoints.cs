using CourseManager.Server.DTOs;
using CourseManager.Server.Models;

public static class CourseEndpoints
{
    public static IEndpointRouteBuilder MapCourseEndpoints(this IEndpointRouteBuilder routes)
    {
        var group = routes.MapGroup("/api/course");

        group.MapGet("/", async (ICourseRepository repo) =>
        {
            var courses = await repo.GetAllAsync();
            return courses.Select(c =>
                new CourseDto(c.CourseId, c.Name, c.Description, c.CreatedAt)
            );
        });

        group.MapGet("/{courseId:int}", async (int courseId, ICourseRepository repo) =>
        {
            var course = await repo.GetByIdAsync(courseId);
            return course is null
                ? Results.NotFound()
                : Results.Ok(new CourseDto(course.CourseId, course.Name, course.Description, course.CreatedAt));
        });

        group.MapPost("/", async (CreateCourseRequest req, ICourseRepository repo) =>
        {
            var course = new Course
            {
                Name = req.Name,
                Description = req.Description
            };

            var created = await repo.CreateAsync(course);

            return Results.Created($"/api/course/{created.CourseId}",
                new CourseDto(created.CourseId, created.Name, created.Description, created.CreatedAt));
        });

        group.MapPut("/{courseId:int}", async (int courseId, UpdateCourseRequest req, ICourseRepository repo) =>
        {
            var updated = await repo.UpdateAsync(courseId, new Course
            {
                Name = req.Name,
                Description = req.Description
            });

            return updated is null
                ? Results.NotFound()
                : Results.Ok(new CourseDto(updated.CourseId, updated.Name, updated.Description, updated.CreatedAt));
        });

        group.MapDelete("/{courseId:int}", async (int courseId, ICourseRepository repo) =>
        {
            var deleted = await repo.DeleteAsync(courseId);
            return deleted ? Results.NoContent() : Results.NotFound();
        });

        return routes;
    }
}
