using CourseManager.Server.DTOs;
using CourseManager.Server.Models;
using CourseManager.Server.Repositories;
using CourseManager.Server.Services;
using System.Security.Claims;

public static class PersonEndpoints
{
    public static IEndpointRouteBuilder MapPersonEndpoints(this IEndpointRouteBuilder routes)
    {
        var group = routes.MapGroup("/api/person").RequireAuthorization();

        group.MapGet("/", async (IPersonRepository repo, ClaimsPrincipal user) =>
        {
            var userId = CurrentUserHelper.GetUserId(user);
            var people = await repo.GetAllAsync(userId);
            return people.Select(p => new PersonDto(p.PersonId, p.FullName));
        });

        group.MapGet("/{personId:int}", async (int personId, IPersonRepository repo, ClaimsPrincipal user) =>
        {
            var userId = CurrentUserHelper.GetUserId(user);
            var person = await repo.GetByIdAsync(personId, userId);
            return person is null
                ? Results.NotFound()
                : Results.Ok(new PersonDto(person.PersonId, person.FullName));
        });

        group.MapPost("/", async (CreatePersonRequest req, IPersonRepository repo, ClaimsPrincipal user) =>
        {
            var userId = CurrentUserHelper.GetUserId(user);
            var existing = await repo.GetByNameAsync(req.FullName, userId);
            if (existing is not null)
            {
                return Results.Conflict(new PersonDto(existing.PersonId, existing.FullName));
            }

            var person = new Person
            {
                FullName = req.FullName,
                UserId = userId
            };

            var created = await repo.CreateAsync(person);

            return Results.Created($"/api/person/{created.PersonId}",
                new PersonDto(created.PersonId, created.FullName));
        });

        group.MapPut("/{personId:int}", async (int personId, UpdatePersonRequest req, IPersonRepository repo, ClaimsPrincipal user) =>
        {
            var userId = CurrentUserHelper.GetUserId(user);
            var updated = await repo.UpdateAsync(personId, new Person
            {
                FullName = req.FullName
            }, userId);

            return updated is null
                ? Results.NotFound()
                : Results.Ok(new PersonDto(updated.PersonId, updated.FullName));
        });

        group.MapDelete("/{personId:int}", async (int personId, IPersonRepository repo, ClaimsPrincipal user) =>
        {
            var userId = CurrentUserHelper.GetUserId(user);
            var deleted = await repo.DeleteAsync(personId, userId);
            return deleted ? Results.NoContent() : Results.NotFound();
        });

        return routes;
    }
}