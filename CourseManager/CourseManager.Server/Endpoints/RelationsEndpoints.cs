using CourseManager.Server.Data;
using CourseManager.Server.DTOs;
using CourseManager.Server.Models;
using CourseManager.Server.Services;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;

public static class RelationsEndpoints
{
    public static IEndpointRouteBuilder MapRelationsEndpoints(this IEndpointRouteBuilder routes)
    {
        var group = routes.MapGroup("/api/relations").RequireAuthorization();

        group.MapGet("/course/{courseId:int}/people", async (int courseId, AppDbContext db, ClaimsPrincipal user) =>
        {
            var userId = CurrentUserHelper.GetUserId(user);
            var people = await db.CoursePeople
                .Where(cp => cp.CourseId == courseId && cp.Course.UserId == userId && cp.Person.UserId == userId)
                .Select(cp => new PersonDto(
                    cp.Person.PersonId,
                    cp.Person.FullName
                ))
                .ToListAsync();

            return Results.Ok(people);
        });

        group.MapPost("/course/{courseId:int}/people/{personId:int}", async (int courseId, int personId, AppDbContext db, ClaimsPrincipal user) =>
        {
            var userId = CurrentUserHelper.GetUserId(user);

            var course = await db.Courses.FirstOrDefaultAsync(c => c.CourseId == courseId && c.UserId == userId);
            if (course is null) return Results.NotFound("Course not found.");

            var person = await db.People.FirstOrDefaultAsync(p => p.PersonId == personId && p.UserId == userId);
            if (person is null) return Results.NotFound("Person not found.");

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

        group.MapDelete("/course/{courseId:int}/people/{personId:int}", async (int courseId, int personId, AppDbContext db, ClaimsPrincipal user) =>
        {
            var userId = CurrentUserHelper.GetUserId(user);
            var link = await db.CoursePeople
                .FirstOrDefaultAsync(cp => cp.CourseId == courseId && cp.PersonId == personId && cp.Course.UserId == userId);
            if (link is null)
                return Results.NotFound();

            db.CoursePeople.Remove(link);
            await db.SaveChangesAsync();
            return Results.NoContent();
        });

        group.MapGet("/section/{sectionId:int}/people", async (int sectionId, AppDbContext db, ClaimsPrincipal user) =>
        {
            var userId = CurrentUserHelper.GetUserId(user);
            var people = await db.CourseSectionPeople
                .Where(sp => sp.CourseSectionId == sectionId && sp.CourseSection.Course.UserId == userId && sp.Person.UserId == userId)
                .Select(sp => new PersonDto(
                    sp.Person.PersonId,
                    sp.Person.FullName
                ))
                .ToListAsync();

            return Results.Ok(people);
        });

        group.MapPost("/section/{sectionId:int}/people/{personId:int}", async (int sectionId, int personId, AppDbContext db, ClaimsPrincipal user) =>
        {
            var userId = CurrentUserHelper.GetUserId(user);

            var section = await db.CourseSections.FirstOrDefaultAsync(s => s.CourseSectionId == sectionId && s.Course.UserId == userId);
            if (section is null) return Results.NotFound("Course section not found.");

            var person = await db.People.FirstOrDefaultAsync(p => p.PersonId == personId && p.UserId == userId);
            if (person is null) return Results.NotFound("Person not found.");

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

        group.MapDelete("/section/{sectionId:int}/people/{personId:int}", async (int sectionId, int personId, AppDbContext db, ClaimsPrincipal user) =>
        {
            var userId = CurrentUserHelper.GetUserId(user);
            var link = await db.CourseSectionPeople
                .FirstOrDefaultAsync(sp => sp.CourseSectionId == sectionId && sp.PersonId == personId && sp.CourseSection.Course.UserId == userId);
            if (link is null)
                return Results.NotFound();

            db.CourseSectionPeople.Remove(link);
            await db.SaveChangesAsync();
            return Results.NoContent();
        });

        group.MapGet("/group/{groupId:int}/people", async (int groupId, AppDbContext db, ClaimsPrincipal user) =>
        {
            var userId = CurrentUserHelper.GetUserId(user);
            var people = await db.GroupPeople
                .Where(gp => gp.GroupId == groupId && gp.Group.CourseSection.Course.UserId == userId && gp.Person.UserId == userId)
                .Select(gp => new PersonDto(
                    gp.Person.PersonId,
                    gp.Person.FullName
                ))
                .ToListAsync();

            return Results.Ok(people);
        });

        group.MapPost("/group/{groupId:int}/people/{personId:int}", async (int groupId, int personId, AppDbContext db, ClaimsPrincipal user) =>
        {
            var userId = CurrentUserHelper.GetUserId(user);

            var grp = await db.Groups.FirstOrDefaultAsync(g => g.GroupId == groupId && g.CourseSection.Course.UserId == userId);
            if (grp is null) return Results.NotFound("Group not found.");

            var person = await db.People.FirstOrDefaultAsync(p => p.PersonId == personId && p.UserId == userId);
            if (person is null) return Results.NotFound("Person not found.");

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

        group.MapDelete("/group/{groupId:int}/people/{personId:int}", async (int groupId, int personId, AppDbContext db, ClaimsPrincipal user) =>
        {
            var userId = CurrentUserHelper.GetUserId(user);
            var link = await db.GroupPeople
                .FirstOrDefaultAsync(gp => gp.GroupId == groupId && gp.PersonId == personId && gp.Group.CourseSection.Course.UserId == userId);
            if (link is null)
                return Results.NotFound();

            db.GroupPeople.Remove(link);
            await db.SaveChangesAsync();
            return Results.NoContent();
        });

        group.MapGet("/person/{personId:int}", async (int personId, AppDbContext db, ClaimsPrincipal user) =>
        {
            var userId = CurrentUserHelper.GetUserId(user);

            var personExists = await db.People.AnyAsync(p => p.PersonId == personId && p.UserId == userId);
            if (!personExists) return Results.NotFound();

            var courses = await db.CoursePeople
                .Where(cp => cp.PersonId == personId && cp.Course.UserId == userId)
                .Select(cp => new CourseDto(
                    cp.Course.CourseId,
                    cp.Course.Name,
                    cp.Course.Description,
                    cp.Course.CreatedAt
                ))
                .ToListAsync();

            var sections = await db.CourseSectionPeople
                .Where(sp => sp.PersonId == personId && sp.CourseSection.Course.UserId == userId)
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
                .Where(gp => gp.PersonId == personId && gp.Group.CourseSection.Course.UserId == userId)
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

        group.MapGet("/person/{personId:int}/overview", async (int personId, AppDbContext db, ClaimsPrincipal user) =>
        {
            var userId = CurrentUserHelper.GetUserId(user);

            var person = await db.People.FirstOrDefaultAsync(p => p.PersonId == personId && p.UserId == userId);
            if (person is null)
                return Results.NotFound();

            var directCourses = await db.CoursePeople
                .Where(cp => cp.PersonId == personId && cp.Course.UserId == userId)
                .Select(cp => cp.Course)
                .ToListAsync();

            var directSections = await db.CourseSectionPeople
                .Where(sp => sp.PersonId == personId && sp.CourseSection.Course.UserId == userId)
                .Include(sp => sp.CourseSection)
                    .ThenInclude(cs => cs.Course)
                .Select(sp => sp.CourseSection)
                .ToListAsync();

            var groups = await db.GroupPeople
                .Where(gp => gp.PersonId == personId && gp.Group.CourseSection.Course.UserId == userId)
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
                .Where(cf => courseIds.Contains(cf.CourseId) && cf.FileAsset.UserId == userId)
                .Select(cf => new
                {
                    File = cf.FileAsset,
                    SourceType = "Program",
                    SourceId = cf.CourseId,
                    SourceName = cf.Course.Name
                })
                .ToListAsync();

            var sectionFiles = await db.CourseSectionFiles
                .Where(sf => sectionIds.Contains(sf.CourseSectionId) && sf.FileAsset.UserId == userId)
                .Select(sf => new
                {
                    File = sf.FileAsset,
                    SourceType = "Kurstillfälle",
                    SourceId = sf.CourseSectionId,
                    SourceName = sf.CourseSection.Name
                })
                .ToListAsync();

            var groupFiles = await db.GroupFiles
                .Where(gf => groupIds.Contains(gf.GroupId) && gf.FileAsset.UserId == userId)
                .Select(gf => new
                {
                    File = gf.FileAsset,
                    SourceType = "Grupp",
                    SourceId = gf.GroupId,
                    SourceName = gf.Group.Name
                })
                .ToListAsync();

            var personFiles = await db.PersonFiles
                .Where(pf => pf.PersonId == personId && pf.FileAsset.UserId == userId)
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