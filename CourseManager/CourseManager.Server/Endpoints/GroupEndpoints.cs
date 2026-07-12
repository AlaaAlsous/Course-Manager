using CourseManager.Server.DTOs;
using CourseManager.Server.Models;
using CourseManager.Server.Repositories;
using CourseManager.Server.Services;
using System.Security.Claims;

public static class GroupEndpoints
{
    public static IEndpointRouteBuilder MapGroupEndpoints(this IEndpointRouteBuilder routes)
    {
        var group = routes.MapGroup("/api/group").RequireAuthorization();

        group.MapGet("/", async (IGroupRepository repo, ClaimsPrincipal user) =>
        {
            var userId = CurrentUserHelper.GetUserId(user);
            var groups = await repo.GetAllAsync(userId);
            return groups.Select(g =>
                new GroupDto(g.GroupId, g.Name, g.CourseSectionId)
            );
        });

        group.MapGet("/{groupId:int}", async (int groupId, IGroupRepository repo, ClaimsPrincipal user) =>
        {
            var userId = CurrentUserHelper.GetUserId(user);
            var g = await repo.GetByIdAsync(groupId, userId);
            return g is null
                ? Results.NotFound()
                : Results.Ok(new GroupDto(g.GroupId, g.Name, g.CourseSectionId));
        });

        group.MapGet("/course-section/{courseSectionId:int}", async (int courseSectionId, IGroupRepository repo, ClaimsPrincipal user) =>
        {
            var userId = CurrentUserHelper.GetUserId(user);
            var groups = await repo.GetByCourseSectionIdAsync(courseSectionId, userId);
            return groups.Select(g =>
                new GroupDto(g.GroupId, g.Name, g.CourseSectionId)
            );
        });

        group.MapPost("/", async (CreateGroupRequest req, IGroupRepository repo, ICourseSectionRepository sectionRepo, ClaimsPrincipal user) =>
        {
            var userId = CurrentUserHelper.GetUserId(user);

            var section = await sectionRepo.GetByIdAsync(req.CourseSectionId, userId);
            if (section is null)
                return Results.NotFound("Course section not found.");

            var g = new Group
            {
                Name = req.Name,
                CourseSectionId = req.CourseSectionId
            };

            var created = await repo.CreateAsync(g);

            return Results.Created($"/api/group/{created.GroupId}",
                new GroupDto(created.GroupId, created.Name, created.CourseSectionId));
        });

        group.MapPut("/{groupId:int}", async (int groupId, UpdateGroupRequest req, IGroupRepository repo, ClaimsPrincipal user) =>
        {
            var userId = CurrentUserHelper.GetUserId(user);
            var updated = await repo.UpdateAsync(groupId, new Group
            {
                Name = req.Name
            }, userId);

            return updated is null
                ? Results.NotFound()
                : Results.Ok(new GroupDto(updated.GroupId, updated.Name, updated.CourseSectionId));
        });

        group.MapDelete("/{groupId:int}", async (int groupId, IGroupRepository repo, ClaimsPrincipal user) =>
        {
            var userId = CurrentUserHelper.GetUserId(user);
            var deleted = await repo.DeleteAsync(groupId, userId);
            return deleted ? Results.NoContent() : Results.NotFound();
        });

        return routes;
    }
}