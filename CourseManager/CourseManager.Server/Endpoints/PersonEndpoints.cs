using CourseManager.Server.DTOs;
using CourseManager.Server.Models;
using CourseManager.Server.Repositories;

public static class PersonEndpoints
{
    public static IEndpointRouteBuilder MapPersonEndpoints(this IEndpointRouteBuilder routes)
    {
        var group = routes.MapGroup("/api/person");

        group.MapGet("/", async (IPersonRepository repo) =>
        {
            var people = await repo.GetAllAsync();
            return people.Select(p => new PersonDto(p.PersonId, p.FullName));
        });

        group.MapGet("/{personId:int}", async (int personId, IPersonRepository repo) =>
        {
            var person = await repo.GetByIdAsync(personId);
            return person is null
                ? Results.NotFound()
                : Results.Ok(new PersonDto(person.PersonId, person.FullName));
        });

        group.MapPost("/", async (CreatePersonRequest req, IPersonRepository repo) =>
        {
            var person = new Person
            {
                FullName = req.FullName
            };

            var created = await repo.CreateAsync(person);

            return Results.Created($"/api/person/{created.PersonId}",
                new PersonDto(created.PersonId, created.FullName));
        });

        group.MapPut("/{personId:int}", async (int personId, UpdatePersonRequest req, IPersonRepository repo) =>
        {
            var updated = await repo.UpdateAsync(personId, new Person
            {
                FullName = req.FullName
            });

            return updated is null
                ? Results.NotFound()
                : Results.Ok(new PersonDto(updated.PersonId, updated.FullName));
        });

        group.MapDelete("/{personId:int}", async (int personId, IPersonRepository repo) =>
        {
            var deleted = await repo.DeleteAsync(personId);
            return deleted ? Results.NoContent() : Results.NotFound();
        });

        return routes;
    }
}
