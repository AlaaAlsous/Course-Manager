using CourseManager.Server.Data;
using CourseManager.Server.DTOs;
using CourseManager.Server.Models;
using Microsoft.EntityFrameworkCore;

public static class RelationsEndpoints
{
    public static IEndpointRouteBuilder MapRelationsEndpoints(this IEndpointRouteBuilder routes)
    {
        var group = routes.MapGroup("/api/relations");

        group.MapGet("/course/{courseId:int}/people", async (int courseId, AppDbContext db) =>
        {
            var people = await db.CoursePeople
                .Where(cp => cp.CourseId == courseId)
                .Select(cp => new PersonDto(
                    cp.Person.PersonId,
                    cp.Person.FullName
                ))
                .ToListAsync();

            return Results.Ok(people);
        });

        group.MapPost("/course/{courseId:int}/people/{personId:int}", async (int courseId, int personId, AppDbContext db) =>
        {
            var exists = await db.CoursePeople.FindAsync(courseId, personId);
            if (exists is not null)
                return Results.Conflict("Person already in course");

            db.CoursePeople.Add(new CoursePerson
            {
                CourseId = courseId,
                PersonId = personId
            });

            await db.SaveChangesAsync();
            return Results.Ok();
        });

        group.MapDelete("/course/{courseId:int}/people/{personId:int}", async (int courseId, int personId, AppDbContext db) =>
        {
            var link = await db.CoursePeople.FindAsync(courseId, personId);
            if (link is null)
                return Results.NotFound();

            db.CoursePeople.Remove(link);
            await db.SaveChangesAsync();
            return Results.NoContent();
        });

        group.MapGet("/section/{sectionId:int}/people", async (int sectionId, AppDbContext db) =>
        {
            var people = await db.CourseSectionPeople
                .Where(sp => sp.CourseSectionId == sectionId)
                .Select(sp => new PersonDto(
                    sp.Person.PersonId,
                    sp.Person.FullName
                ))
                .ToListAsync();

            return Results.Ok(people);
        });

        group.MapPost("/section/{sectionId:int}/people/{personId:int}", async (int sectionId, int personId, AppDbContext db) =>
        {
            var exists = await db.CourseSectionPeople.FindAsync(sectionId, personId);
            if (exists is not null)
                return Results.Conflict("Person already in section");

            db.CourseSectionPeople.Add(new CourseSectionPerson
            {
                CourseSectionId = sectionId,
                PersonId = personId
            });

            await db.SaveChangesAsync();
            return Results.Ok();
        });

        group.MapDelete("/section/{sectionId:int}/people/{personId:int}", async (int sectionId, int personId, AppDbContext db) =>
        {
            var link = await db.CourseSectionPeople.FindAsync(sectionId, personId);
            if (link is null)
                return Results.NotFound();

            db.CourseSectionPeople.Remove(link);
            await db.SaveChangesAsync();
            return Results.NoContent();
        });

        group.MapGet("/group/{groupId:int}/people", async (int groupId, AppDbContext db) =>
        {
            var people = await db.GroupPeople
                .Where(gp => gp.GroupId == groupId)
                .Select(gp => new PersonDto(
                    gp.Person.PersonId,
                    gp.Person.FullName
                ))
                .ToListAsync();

            return Results.Ok(people);
        });

        group.MapPost("/group/{groupId:int}/people/{personId:int}", async (int groupId, int personId, AppDbContext db) =>
        {
            var exists = await db.GroupPeople.FindAsync(groupId, personId);
            if (exists is not null)
                return Results.Conflict("Person already in group");

            db.GroupPeople.Add(new GroupPerson
            {
                GroupId = groupId,
                PersonId = personId
            });

            await db.SaveChangesAsync();
            return Results.Ok();
        });

        group.MapDelete("/group/{groupId:int}/people/{personId:int}", async (int groupId, int personId, AppDbContext db) =>
        {
            var link = await db.GroupPeople.FindAsync(groupId, personId);
            if (link is null)
                return Results.NotFound();

            db.GroupPeople.Remove(link);
            await db.SaveChangesAsync();
            return Results.NoContent();
        });

        group.MapGet("/person/{personId:int}", async (int personId, AppDbContext db) =>
        {
            var courses = await db.CoursePeople
                .Where(cp => cp.PersonId == personId)
                .Select(cp => new CourseDto(
                    cp.Course.CourseId,
                    cp.Course.Name,
                    cp.Course.Description,
                    cp.Course.CreatedAt
                ))
                .ToListAsync();

            var sections = await db.CourseSectionPeople
                .Where(sp => sp.PersonId == personId)
                .Select(sp => new CourseSectionDto(
                    sp.CourseSection.CourseSectionId,
                    sp.CourseSection.Name,
                    sp.CourseSection.Description,
                    sp.CourseSection.CreatedAt,
                    sp.CourseSection.StartDate,
                    sp.CourseSection.EndDate,
                    sp.CourseSection.CourseId
                ))
                .ToListAsync();

            var groups = await db.GroupPeople
                .Where(gp => gp.PersonId == personId)
                .Select(gp => new GroupDto(
                    gp.Group.GroupId,
                    gp.Group.Name,
                    gp.Group.CourseSectionId
                ))
                .ToListAsync();

            return Results.Ok(new
            {
                Courses = courses,
                Sections = sections,
                Groups = groups
            });
        });

        return routes;
    }
}
