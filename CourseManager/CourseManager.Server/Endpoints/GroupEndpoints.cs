using CourseManager.Server.DTOs;
using CourseManager.Server.Models;
using CourseManager.Server.Repositories;

public static class GroupEndpoints
{
    public static IEndpointRouteBuilder MapGroupEndpoints(this IEndpointRouteBuilder routes)
    {
        var group = routes.MapGroup("/api/group");

        group.MapGet("/", async (IGroupRepository repo) =>
        {
            var groups = await repo.GetAllAsync();
            return groups.Select(g =>
                new GroupDto(g.GroupId, g.Name, g.CourseSectionId)
            );
        });

        group.MapGet("/{groupId:int}", async (int groupId, IGroupRepository repo) =>
        {
            var g = await repo.GetByIdAsync(groupId);
            return g is null
                ? Results.NotFound()
                : Results.Ok(new GroupDto(g.GroupId, g.Name, g.CourseSectionId));
        });

        group.MapGet("/course-section/{courseSectionId:int}", async (int courseSectionId, IGroupRepository repo) =>
        {
            var groups = await repo.GetByCourseSectionIdAsync(courseSectionId);
            return groups.Select(g =>
                new GroupDto(g.GroupId, g.Name, g.CourseSectionId)
            );
        });

        group.MapPost("/", async (CreateGroupRequest req, IGroupRepository repo) =>
        {
            var g = new Group
            {
                Name = req.Name,
                CourseSectionId = req.CourseSectionId
            };

            var created = await repo.CreateAsync(g);

            return Results.Created($"/api/group/{created.GroupId}",
                new GroupDto(created.GroupId, created.Name, created.CourseSectionId));
        });

        group.MapPut("/{groupId:int}", async (int groupId, UpdateGroupRequest req, IGroupRepository repo) =>
        {
            var updated = await repo.UpdateAsync(groupId, new Group
            {
                Name = req.Name
            });

            return updated is null
                ? Results.NotFound()
                : Results.Ok(new GroupDto(updated.GroupId, updated.Name, updated.CourseSectionId));
        });

        group.MapDelete("/{groupId:int}", async (int groupId, IGroupRepository repo) =>
        {
            var deleted = await repo.DeleteAsync(groupId);
            return deleted ? Results.NoContent() : Results.NotFound();
        });

        return routes;
    }
}
