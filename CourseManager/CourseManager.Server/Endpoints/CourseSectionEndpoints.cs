using CourseManager.Server.DTOs;
using CourseManager.Server.Models;
using CourseManager.Server.Repositories;
using CourseManager.Server.Services;
using System.Security.Claims;

public static class CourseSectionEndpoints
{
    public static IEndpointRouteBuilder MapCourseSectionEndpoints(this IEndpointRouteBuilder routes)
    {
        var group = routes.MapGroup("/api/course-section").RequireAuthorization();

        group.MapGet("/", async (ICourseSectionRepository repo, ClaimsPrincipal user) =>
        {
            var userId = CurrentUserHelper.GetUserId(user);
            var sections = await repo.GetAllAsync(userId);
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

        group.MapGet("/{courseSectionId:int}", async (int courseSectionId, ICourseSectionRepository repo, ClaimsPrincipal user) =>
        {
            var userId = CurrentUserHelper.GetUserId(user);
            var section = await repo.GetByIdAsync(courseSectionId, userId);
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

        group.MapGet("/course/{courseId:int}", async (int courseId, ICourseSectionRepository repo, ClaimsPrincipal user) =>
        {
            var userId = CurrentUserHelper.GetUserId(user);
            var sections = await repo.GetByCourseIdAsync(courseId, userId);
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

        group.MapPost("/", async (CreateCourseSectionRequest req, ICourseSectionRepository repo, ICourseRepository courseRepo, ClaimsPrincipal user) =>
        {
            var userId = CurrentUserHelper.GetUserId(user);

            var course = await courseRepo.GetByIdAsync(req.CourseId, userId);
            if (course is null)
                return Results.NotFound("Course not found.");

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

        group.MapPut("/{courseSectionId:int}", async (int courseSectionId, UpdateCourseSectionRequest req, ICourseSectionRepository repo, ClaimsPrincipal user) =>
        {
            var userId = CurrentUserHelper.GetUserId(user);
            var updated = await repo.UpdateAsync(courseSectionId, new CourseSection
            {
                Name = req.Name,
                Description = req.Description,
                StartDate = req.StartDate,
                EndDate = req.EndDate
            }, userId);

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

        group.MapDelete("/{courseSectionId:int}", async (int courseSectionId, ICourseSectionRepository repo, ClaimsPrincipal user) =>
        {
            var userId = CurrentUserHelper.GetUserId(user);
            var deleted = await repo.DeleteAsync(courseSectionId, userId);
            return deleted ? Results.NoContent() : Results.NotFound();
        });

        return routes;
    }
}