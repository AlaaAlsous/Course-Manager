using CourseManager.Server.Data;
using CourseManager.Server.DTOs;
using CourseManager.Server.Models;
using CourseManager.Server.Repositories;
using Microsoft.EntityFrameworkCore;
using System.IO.Compression;

public static class FileEndpoints
{
    public static IEndpointRouteBuilder MapFileEndpoints(this IEndpointRouteBuilder routes)
    {
        var group = routes.MapGroup("/api/files");

        group.MapGet("/{fileAssetId:int}", async (int fileAssetId, IFileRepository repo) =>
        {
            var file = await repo.GetByIdAsync(fileAssetId);
            return file is null
                ? Results.NotFound()
                : Results.Ok(new FileAssetDto(
                    file.FileAssetId,
                    file.FileName,
                    file.LocalPath,
                    file.CloudPath,
                    file.StorageProvider,
                    file.FileType,
                    file.FileSize,
                    file.UploadedAt
                ));
        });

        group.MapPost("/upload/{entityType}/{entityId:int}", async (
            string entityType,
            int entityId,
            HttpRequest request,
            IFileRepository repo) =>
        {
            var form = await request.ReadFormAsync();
            var uploadedFile = form.Files.FirstOrDefault();

            if (uploadedFile is null)
                return Results.BadRequest("No file uploaded");

            var uploadsPath = Path.Combine("uploads");
            Directory.CreateDirectory(uploadsPath);

            var timestamp = DateTime.UtcNow.ToString("yyyyMMdd_HHmmss");
            var originalName = Path.GetFileNameWithoutExtension(uploadedFile.FileName);
            var extension = Path.GetExtension(uploadedFile.FileName);
            var finalFileName = $"{originalName}_{timestamp}{extension}";
            var filePath = Path.Combine(uploadsPath, finalFileName);

            using (var stream = new FileStream(filePath, FileMode.Create))
                await uploadedFile.CopyToAsync(stream);

            var fileAsset = new FileAsset
            {
                FileName = finalFileName,
                LocalPath = filePath,
                CloudPath = null,
                StorageProvider = "local",
                FileType = uploadedFile.ContentType,
                FileSize = uploadedFile.Length
            };

            var created = await repo.CreateAsync(fileAsset);

            switch (entityType.ToLower())
            {
                case "course":
                    await repo.AddToCourseAsync(entityId, created.FileAssetId);
                    break;

                case "section":
                case "coursesection":
                    await repo.AddToCourseSectionAsync(entityId, created.FileAssetId);
                    break;

                case "group":
                    await repo.AddToGroupAsync(entityId, created.FileAssetId);
                    break;

                case "person":
                    await repo.AddToPersonAsync(entityId, created.FileAssetId);
                    break;

                default:
                    return Results.BadRequest("Invalid entity type. Use: course, section, group, person.");
            }

            return Results.Ok(new FileAssetDto(
                created.FileAssetId,
                created.FileName,
                created.LocalPath,
                created.CloudPath,
                created.StorageProvider,
                created.FileType,
                created.FileSize,
                created.UploadedAt
            ));
        });

        group.MapPost("/create-empty/{entityType}/{entityId:int}", async (
            string entityType,
            int entityId,
            IFileRepository repo) =>
        {
            var uploadsPath = Path.Combine("uploads");
            Directory.CreateDirectory(uploadsPath);

            var timestamp = DateTime.UtcNow.ToString("yyyyMMdd_HHmmss");
            var fileName = $"note_{timestamp}.txt";
            var filePath = Path.Combine(uploadsPath, fileName);

            await File.WriteAllTextAsync(filePath, "");

            var fileAsset = new FileAsset
            {
                FileName = fileName,
                LocalPath = filePath,
                CloudPath = null,
                StorageProvider = "local",
                FileType = "text/plain",
                FileSize = 0
            };

            var created = await repo.CreateAsync(fileAsset);

            switch (entityType.ToLower())
            {
                case "course":
                    await repo.AddToCourseAsync(entityId, created.FileAssetId);
                    break;

                case "section":
                case "coursesection":
                    await repo.AddToCourseSectionAsync(entityId, created.FileAssetId);
                    break;

                case "group":
                    await repo.AddToGroupAsync(entityId, created.FileAssetId);
                    break;

                case "person":
                    await repo.AddToPersonAsync(entityId, created.FileAssetId);
                    break;

                default:
                    return Results.BadRequest("Invalid entity type. Use: course, section, group, person.");
            }

            return Results.Ok(new
            {
                fileAssetId = created.FileAssetId,
                fileName = created.FileName
            });
        });

        group.MapDelete("/{fileAssetId:int}", async (int fileAssetId, IFileRepository repo) =>
        {
            var deleted = await repo.DeleteAsync(fileAssetId);
            return deleted ? Results.NoContent() : Results.NotFound();
        });

        group.MapGet("/{fileAssetId:int}/content", async (int fileAssetId, IFileRepository repo) =>
        {
            var content = await repo.ReadFileContentAsync(fileAssetId);
            return content is null ? Results.NotFound() : Results.Ok(content);
        });

        group.MapPut("/{fileAssetId:int}/content", async (int fileAssetId, UpdateFileContentRequest req, IFileRepository repo) =>
        {
            var ok = await repo.WriteFileContentAsync(fileAssetId, req.Content);
            return ok ? Results.NoContent() : Results.NotFound();
        });

        group.MapGet("/course/{courseId:int}", async (int courseId, IFileRepository repo) =>
        {
            var files = await repo.GetFilesForCourseAsync(courseId);
            return files.Select(f => new FileAssetDto(
                f.FileAssetId, f.FileName, f.LocalPath, f.CloudPath,
                f.StorageProvider, f.FileType, f.FileSize, f.UploadedAt
            ));
        });

        group.MapGet("/course-section/{courseSectionId:int}", async (int courseSectionId, IFileRepository repo) =>
        {
            var files = await repo.GetFilesForCourseSectionAsync(courseSectionId);
            return files.Select(f => new FileAssetDto(
                f.FileAssetId, f.FileName, f.LocalPath, f.CloudPath,
                f.StorageProvider, f.FileType, f.FileSize, f.UploadedAt
            ));
        });

        group.MapGet("/group/{groupId:int}", async (int groupId, IFileRepository repo) =>
        {
            var files = await repo.GetFilesForGroupAsync(groupId);
            return files.Select(f => new FileAssetDto(
                f.FileAssetId, f.FileName, f.LocalPath, f.CloudPath,
                f.StorageProvider, f.FileType, f.FileSize, f.UploadedAt
            ));
        });

        group.MapGet("/person/{personId:int}", async (int personId, IFileRepository repo) =>
        {
            var files = await repo.GetFilesForPersonAsync(personId);
            return files.Select(f => new FileAssetDto(
                f.FileAssetId, f.FileName, f.LocalPath, f.CloudPath,
                f.StorageProvider, f.FileType, f.FileSize, f.UploadedAt
            ));
        });

        group.MapGet("/{fileAssetId:int}/download", async (int fileAssetId, IFileRepository repo) =>
        {
            var file = await repo.GetByIdAsync(fileAssetId);
            if (file is null || !System.IO.File.Exists(file.LocalPath))
                return Results.NotFound();

            var stream = new FileStream(file.LocalPath, FileMode.Open, FileAccess.Read);
            return Results.File(stream, file.FileType, file.FileName);
        });

        group.MapGet("/download/{entityType}/{entityId:int}", async (
            string entityType,
            int entityId,
            AppDbContext db,
            IFileRepository repo) =>
        {
            using var memoryStream = new MemoryStream();
            using var zip = new ZipArchive(memoryStream, ZipArchiveMode.Create, true);

            entityType = entityType.ToLower();

            switch (entityType)
            {
                case "course":
                    {
                        var course = await db.Courses
                            .Include(c => c.CourseFiles)
                            .Include(c => c.CourseSections)
                                .ThenInclude(cs => cs.CourseSectionFiles)
                            .Include(c => c.CourseSections)
                                .ThenInclude(cs => cs.Groups)
                                    .ThenInclude(g => g.GroupFiles)
                            .Include(c => c.CoursePeople)
                                .ThenInclude(cp => cp.Person)
                            .FirstOrDefaultAsync(c => c.CourseId == entityId);

                        if (course is null)
                            return Results.NotFound("Course not found");

                        foreach (var cf in course.CourseFiles)
                            await AddFileToZip(zip, repo, cf.FileAssetId, "Course/");

                        foreach (var section in course.CourseSections)
                            foreach (var sf in section.CourseSectionFiles)
                                await AddFileToZip(zip, repo, sf.FileAssetId, "Course/CourseSections/");

                        foreach (var section in course.CourseSections)
                            foreach (var groupEntity in section.Groups)
                                foreach (var gf in groupEntity.GroupFiles)
                                    await AddFileToZip(zip, repo, gf.FileAssetId, "Course/Groups/");

                        foreach (var cp in course.CoursePeople)
                        {
                            var personFiles = await repo.GetFilesForPersonAsync(cp.PersonId);
                            foreach (var file in personFiles)
                                await AddFileToZip(zip, repo, file.FileAssetId, "Course/People/");
                        }

                        break;
                    }
                case "course-section":
                    {
                        var section = await db.CourseSections
                            .Include(s => s.CourseSectionFiles)
                            .Include(s => s.Groups)
                                .ThenInclude(g => g.GroupFiles)
                            .Include(s => s.CourseSectionPeople)
                                .ThenInclude(sp => sp.Person)
                            .FirstOrDefaultAsync(s => s.CourseSectionId == entityId);

                        if (section is null)
                            return Results.NotFound("CourseSection not found");

                        foreach (var sf in section.CourseSectionFiles)
                            await AddFileToZip(zip, repo, sf.FileAssetId, "CourseSection/");

                        foreach (var groupEntity in section.Groups)
                            foreach (var gf in groupEntity.GroupFiles)
                                await AddFileToZip(zip, repo, gf.FileAssetId, "CourseSection/Groups/");

                        foreach (var sp in section.CourseSectionPeople)
                        {
                            var personFiles = await repo.GetFilesForPersonAsync(sp.PersonId);
                            foreach (var file in personFiles)
                                await AddFileToZip(zip, repo, file.FileAssetId, "CourseSection/People/");
                        }

                        break;
                    }

                case "group":
                    {
                        var groupEntity = await db.Groups
                            .Include(g => g.GroupFiles)
                            .Include(g => g.GroupPeople)
                                .ThenInclude(gp => gp.Person)
                            .FirstOrDefaultAsync(g => g.GroupId == entityId);

                        if (groupEntity is null)
                            return Results.NotFound("Group not found");

                        foreach (var gf in groupEntity.GroupFiles)
                            await AddFileToZip(zip, repo, gf.FileAssetId, "Group/");

                        foreach (var gp in groupEntity.GroupPeople)
                        {
                            var personFiles = await repo.GetFilesForPersonAsync(gp.PersonId);
                            foreach (var file in personFiles)
                                await AddFileToZip(zip, repo, file.FileAssetId, "Group/People/");
                        }

                        break;
                    }

                case "person":
                    {
                        var person = await db.People
                            .Include(p => p.PersonFiles)
                            .FirstOrDefaultAsync(p => p.PersonId == entityId);

                        if (person is null)
                            return Results.NotFound("Person not found");

                        foreach (var pf in person.PersonFiles)
                            await AddFileToZip(zip, repo, pf.FileAssetId, "Person/");

                        break;
                    }

                default:
                    return Results.BadRequest("Invalid entity type. Use: course, course-section, group, person.");
            }

            zip.Dispose();
            memoryStream.Position = 0;

            return Results.File(
                memoryStream,
                "application/zip",
                $"{entityType}-{entityId}.zip"
            );
        group.MapDelete("/course/{courseId:int}/{fileAssetId:int}", async (
            int courseId,
            int fileAssetId,
            IFileRepository repo) =>
        {
            var ok = await repo.RemoveFileFromCourseAsync(courseId, fileAssetId);
            return ok ? Results.NoContent() : Results.NotFound();
        });

        group.MapDelete("/course-section/{sectionId:int}/{fileAssetId:int}", async (
            int sectionId,
            int fileAssetId,
            IFileRepository repo) =>
        {
            var ok = await repo.RemoveFileFromCourseSectionAsync(sectionId, fileAssetId);
            return ok ? Results.NoContent() : Results.NotFound();
        });

        group.MapDelete("/group/{groupId:int}/{fileAssetId:int}", async (
        int groupId,
        int fileAssetId,
        IFileRepository repo) =>
        {
            var ok = await repo.RemoveFileFromGroupAsync(groupId, fileAssetId);
            return ok ? Results.NoContent() : Results.NotFound();
        });

        group.MapDelete("/person/{personId:int}/{fileAssetId:int}", async (
            int personId,
            int fileAssetId,
            IFileRepository repo) =>
        {
            var ok = await repo.RemoveFileFromPersonAsync(personId, fileAssetId);
            return ok ? Results.NoContent() : Results.NotFound();
        });

        return routes;
    }

    static async Task AddFileToZip(ZipArchive zip, IFileRepository repo, int fileId, string folder)
    {
        var file = await repo.GetByIdAsync(fileId);
        if (file is null || !System.IO.File.Exists(file.LocalPath))
            return;

        var entry = zip.CreateEntry($"{folder}{file.FileName}");
        using var entryStream = entry.Open();
        using var fileStream = new FileStream(file.LocalPath, FileMode.Open, FileAccess.Read);
        await fileStream.CopyToAsync(entryStream);
    }
}
