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
            return sections.Select(s =>
                new CourseSectionDto(
                    s.CourseSectionId,
                    s.Name,
                    s.Description,
                    s.CreatedAt,
                    s.StartDate,
                    s.EndDate,
                    s.CourseId
                )
            );
        });

        group.MapGet("/{courseSectionId:int}", async (int courseSectionId, ICourseSectionRepository repo) =>
        {
            var section = await repo.GetByIdAsync(courseSectionId);
            return section is null
                ? Results.NotFound()
                : Results.Ok(new CourseSectionDto(
                    section.CourseSectionId,
                    section.Name,
                    section.Description,
                    section.CreatedAt,
                    section.StartDate,
                    section.EndDate,
                    section.CourseId
                ));
        });

        group.MapGet("/course/{courseId:int}", async (int courseId, ICourseSectionRepository repo) =>
        {
            var sections = await repo.GetByCourseIdAsync(courseId);
            return sections.Select(s =>
                new CourseSectionDto(
                    s.CourseSectionId,
                    s.Name,
                    s.Description,
                    s.CreatedAt,
                    s.StartDate,
                    s.EndDate,
                    s.CourseId
                )
            );
        });

        group.MapPost("/", async (CreateCourseSectionRequest req, ICourseSectionRepository repo) =>
        {
            var section = new CourseSection
            {
                Name = req.Name,
                Description = req.Description,
                StartDate = req.StartDate,
                EndDate = req.EndDate,
                CourseId = req.CourseId
            };

            var created = await repo.CreateAsync(section);

            return Results.Created($"/api/course-section/{created.CourseSectionId}",
                new CourseSectionDto(
                    created.CourseSectionId,
                    created.Name,
                    created.Description,
                    created.CreatedAt,
                    created.StartDate,
                    created.EndDate,
                    created.CourseId
                ));
        });

        group.MapPut("/{courseSectionId:int}", async (int courseSectionId, UpdateCourseSectionRequest req, ICourseSectionRepository repo) =>
        {
            var updated = await repo.UpdateAsync(courseSectionId, new CourseSection
            {
                Name = req.Name,
                Description = req.Description,
                StartDate = req.StartDate,
                EndDate = req.EndDate
            });

            return updated is null
                ? Results.NotFound()
                : Results.Ok(new CourseSectionDto(
                    updated.CourseSectionId,
                    updated.Name,
                    updated.Description,
                    updated.CreatedAt,
                    updated.StartDate,
                    updated.EndDate,
                    updated.CourseId
                ));
        });

        group.MapDelete("/{courseSectionId:int}", async (int courseSectionId, ICourseSectionRepository repo) =>
        {
            var deleted = await repo.DeleteAsync(courseSectionId);
            return deleted ? Results.NoContent() : Results.NotFound();
        });

        return routes;
    }
}
