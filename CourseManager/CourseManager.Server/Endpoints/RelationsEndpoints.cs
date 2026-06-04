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

        group.MapGet("/person/{personId:int}/overview", async (int personId, AppDbContext db) =>
        {
            var person = await db.People.FindAsync(personId);
            if (person is null)
                return Results.NotFound();

            var directCourses = await db.CoursePeople
                .Where(cp => cp.PersonId == personId)
                .Select(cp => cp.Course)
                .ToListAsync();

            var directSections = await db.CourseSectionPeople
                .Where(sp => sp.PersonId == personId)
                .Include(sp => sp.CourseSection)
                    .ThenInclude(cs => cs.Course)
                .Select(sp => sp.CourseSection)
                .ToListAsync();

            var groups = await db.GroupPeople
                .Where(gp => gp.PersonId == personId)
                .Include(gp => gp.Group)
                    .ThenInclude(g => g.CourseSection)
                        .ThenInclude(cs => cs.Course)
                .Select(gp => gp.Group)
                .ToListAsync();

            var sections = directSections
                .Concat(groups.Select(g => g.CourseSection))
                .DistinctBy(s => s.CourseSectionId)
                .ToList();

            var courses = directCourses
                .Concat(sections.Select(s => s.Course))
                .DistinctBy(c => c.CourseId)
                .ToList();

            var courseIds = courses.Select(c => c.CourseId).ToList();
            var sectionIds = sections.Select(s => s.CourseSectionId).ToList();
            var groupIds = groups.Select(g => g.GroupId).ToList();

            var courseFiles = await db.CourseFiles
                .Where(cf => courseIds.Contains(cf.CourseId))
                .Select(cf => new
                {
                    File = cf.FileAsset,
                    SourceType = "Program",
                    SourceId = cf.CourseId,
                    SourceName = cf.Course.Name
                })
                .ToListAsync();

            var sectionFiles = await db.CourseSectionFiles
                .Where(sf => sectionIds.Contains(sf.CourseSectionId))
                .Select(sf => new
                {
                    File = sf.FileAsset,
                    SourceType = "Kurstillfälle",
                    SourceId = sf.CourseSectionId,
                    SourceName = sf.CourseSection.Name
                })
                .ToListAsync();

            var groupFiles = await db.GroupFiles
                .Where(gf => groupIds.Contains(gf.GroupId))
                .Select(gf => new
                {
                    File = gf.FileAsset,
                    SourceType = "Grupp",
                    SourceId = gf.GroupId,
                    SourceName = gf.Group.Name
                })
                .ToListAsync();

            var personFiles = await db.PersonFiles
                .Where(pf => pf.PersonId == personId)
                .Select(pf => new
                {
                    File = pf.FileAsset,
                    SourceType = "Deltagare",
                    SourceId = personId,
                    SourceName = person.FullName
                })
                .ToListAsync();

            var files = courseFiles
                .Concat(sectionFiles)
                .Concat(groupFiles)
                .Concat(personFiles)
                .GroupBy(item => item.File.FileAssetId)
                .Select(grouped =>
                {
                    var item = grouped.First();
                    return new
                    {
                        item.File.FileAssetId,
                        item.File.FileName,
                        item.File.LocalPath,
                        item.File.CloudPath,
                        item.File.StorageProvider,
                        item.File.FileType,
                        item.File.FileSize,
                        item.File.UploadedAt,
                        item.SourceType,
                        item.SourceId,
                        item.SourceName
                    };
                })
                .OrderByDescending(f => f.UploadedAt)
                .ToList();

            return Results.Ok(new
            {
                Person = new PersonDto(person.PersonId, person.FullName),
                Courses = courses
                    .OrderByDescending(c => c.CreatedAt)
                    .Select(c => new CourseDto(c.CourseId, c.Name, c.Description, c.CreatedAt)),
                Sections = sections
                    .OrderByDescending(s => s.CreatedAt)
                    .Select(s => new CourseSectionDto(
                        s.CourseSectionId,
                        s.Name,
                        s.Description,
                        s.CreatedAt,
                        s.StartDate,
                        s.EndDate,
                        s.CourseId
                    )),
                Groups = groups
                    .OrderBy(g => g.Name)
                    .Select(g => new GroupDto(g.GroupId, g.Name, g.CourseSectionId)),
                Files = files
            });
        });

        return routes;
    }
}
