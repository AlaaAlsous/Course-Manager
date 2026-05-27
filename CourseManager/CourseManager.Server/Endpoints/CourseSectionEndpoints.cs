using CourseManager.Server.DTOs;
using CourseManager.Server.Models;
using CourseManager.Server.Repositories;

public static class CourseSectionEndpoints
{
    public static IEndpointRouteBuilder MapCourseSectionEndpoints(this IEndpointRouteBuilder routes)
    {
        var group = routes.MapGroup("/api/course-section");

        group.MapGet("/", async (ICourseSectionRepository repo) =>
        {
            var sections = await repo.GetAllAsync();
            return sections.Select(s => new CourseSectionDto(s.CourseSectionId, s.Name, s.CourseId));
        });

        group.MapGet("/{id:int}", async (int id, ICourseSectionRepository repo) =>
        {
            var section = await repo.GetByIdAsync(id);
            return section is null
                ? Results.NotFound()
                : Results.Ok(new CourseSectionDto(section.CourseSectionId, section.Name, section.CourseId));
        });

        group.MapGet("/course/{courseId:int}", async (int courseId, ICourseSectionRepository repo) =>
        {
            var sections = await repo.GetByCourseIdAsync(courseId);
            return sections.Select(s => new CourseSectionDto(s.CourseSectionId, s.Name, s.CourseId));
        });

        group.MapPost("/", async (CreateCourseSectionRequest req, ICourseSectionRepository repo) =>
        {
            var section = new CourseSection
            {
                Name = req.Name,
                CourseId = req.CourseId
            };

            var created = await repo.CreateAsync(section);

            return Results.Created($"/api/course-section/{created.CourseSectionId}",
                new CourseSectionDto(created.CourseSectionId, created.Name, created.CourseId));
        });

        group.MapPut("/{id:int}", async (int id, UpdateCourseSectionRequest req, ICourseSectionRepository repo) =>
        {
            var updated = await repo.UpdateAsync(id, new CourseSection { Name = req.Name });

            return updated is null
                ? Results.NotFound()
                : Results.Ok(new CourseSectionDto(updated.CourseSectionId, updated.Name, updated.CourseId));
        });

        group.MapDelete("/{id:int}", async (int id, ICourseSectionRepository repo) =>
        {
            var deleted = await repo.DeleteAsync(id);
            return deleted ? Results.NoContent() : Results.NotFound();
        });

        return routes;
    }
}
