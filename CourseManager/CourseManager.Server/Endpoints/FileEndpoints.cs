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
                    file.FileAssetId, file.FileName, file.LocalPath, file.CloudPath,
                    file.StorageProvider, file.FileType, file.FileSize, file.UploadedAt));
        });

        group.MapPost("/upload/{entityType}/{entityId:int}", async (
            string entityType, int entityId, HttpRequest request, AppDbContext db,
            IFileRepository repo, BlobService blobService, IConfiguration config) =>
        {
            var type = entityType.ToLower();
            if (type is not ("course" or "section" or "coursesection" or "group" or "person"))
                return Results.BadRequest("Invalid entity type. Use: course, section, group, person.");

            var entityExists = type switch
            {
                "course" => await db.Courses.AnyAsync(c => c.CourseId == entityId),
                "section" or "coursesection" => await db.CourseSections.AnyAsync(s => s.CourseSectionId == entityId),
                "group" => await db.Groups.AnyAsync(g => g.GroupId == entityId),
                "person" => await db.People.AnyAsync(p => p.PersonId == entityId),
                _ => false
            };

            if (!entityExists)
                return Results.NotFound("Entity with given ID does not exist.");

            var form = await request.ReadFormAsync();
            var uploadedFile = form.Files.FirstOrDefault();
            if (uploadedFile is null)
                return Results.BadRequest("No file uploaded");

            var safeName = Path.GetFileName(uploadedFile.FileName);
            if (string.IsNullOrWhiteSpace(safeName))
                return Results.BadRequest("Invalid file name.");
            if (safeName.Length > 200)
                return Results.BadRequest("File name too long.");
            if (safeName.IndexOfAny(Path.GetInvalidFileNameChars()) >= 0)
                return Results.BadRequest("File name contains invalid characters.");

            var allowedMimeTypes = new[] { "image/png", "image/jpeg", "image/jpg", "application/pdf", "text/plain" };
            if (!allowedMimeTypes.Contains(uploadedFile.ContentType))
                return Results.BadRequest("Invalid file type.");

            var allowedExtensions = new[] { ".png", ".jpg", ".jpeg", ".pdf", ".txt" };
            var extension = Path.GetExtension(safeName).ToLower();
            if (!allowedExtensions.Contains(extension))
                return Results.BadRequest("Invalid file extension.");

            const long maxSize = 50 * 1024 * 1024;
            if (uploadedFile.Length > maxSize)
                return Results.BadRequest("File too large. Max 50 MB.");

            var timestamp = DateTime.UtcNow.ToString("yyyyMMdd_HHmmss_fff");
            var originalName = Path.GetFileNameWithoutExtension(safeName);
            var finalFileName = $"{originalName}_{timestamp}{extension}";

            var useAzure = !string.IsNullOrWhiteSpace(config["AzureStorage:ConnectionString"]);
            FileAsset? fileAsset = null;

            try
            {
                if (useAzure)
                {
                    var blobUrl = await blobService.UploadAsync(finalFileName, uploadedFile.OpenReadStream());
                    fileAsset = new FileAsset
                    {
                        FileName = finalFileName,
                        LocalPath = null,
                        CloudPath = blobUrl,
                        StorageProvider = "azure",
                        FileType = uploadedFile.ContentType,
                        FileSize = uploadedFile.Length
                    };
                }
                else
                {
                    var uploadsPath = Path.Combine("uploads");
                    Directory.CreateDirectory(uploadsPath);
                    var filePath = Path.Combine(uploadsPath, finalFileName);
                    using var stream = new FileStream(filePath, FileMode.Create);
                    await uploadedFile.CopyToAsync(stream);
                    fileAsset = new FileAsset
                    {
                        FileName = finalFileName,
                        LocalPath = filePath,
                        CloudPath = null,
                        StorageProvider = "local",
                        FileType = uploadedFile.ContentType,
                        FileSize = uploadedFile.Length
                    };
                }

                var created = await repo.CreateAsync(fileAsset);

                switch (type)
                {
                    case "course": await repo.AddToCourseAsync(entityId, created.FileAssetId); break;
                    case "section": case "coursesection": await repo.AddToCourseSectionAsync(entityId, created.FileAssetId); break;
                    case "group": await repo.AddToGroupAsync(entityId, created.FileAssetId); break;
                    case "person": await repo.AddToPersonAsync(entityId, created.FileAssetId); break;
                }

                return Results.Ok(new FileAssetDto(
                    created.FileAssetId, created.FileName, created.LocalPath, created.CloudPath,
                    created.StorageProvider, created.FileType, created.FileSize, created.UploadedAt));
            }
            catch (Exception ex)
            {
                if (!useAzure && fileAsset?.LocalPath is not null && File.Exists(fileAsset.LocalPath))
                    File.Delete(fileAsset.LocalPath);
                return Results.Problem($"Upload failed: {ex.Message}");
            }
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

        group.MapGet("/{fileAssetId:int}/download", async (int fileAssetId, IFileRepository repo, BlobService blobService) =>
        {
            var file = await repo.GetByIdAsync(fileAssetId);
            if (file is null) return Results.NotFound("File not found");

            if (file.StorageProvider == "azure")
            {
                var stream = await blobService.DownloadAsync(file.FileName);
                return Results.File(stream, file.FileType ?? "application/octet-stream", file.FileName);
            }
            if (file.StorageProvider == "local" && file.LocalPath is not null && System.IO.File.Exists(file.LocalPath))
            {
                var stream = System.IO.File.OpenRead(file.LocalPath);
                return Results.File(stream, file.FileType ?? "application/octet-stream", file.FileName);
            }
            return Results.NotFound("File not found");
        });

        group.MapGet("/{fileAssetId:int}/inline", async (int fileAssetId, IFileRepository repo, BlobService blobService) =>
        {
            var file = await repo.GetByIdAsync(fileAssetId);
            if (file is null) return Results.NotFound("File not found");

            if (file.StorageProvider == "azure")
            {
                var stream = await blobService.DownloadAsync(file.FileName);
                return Results.File(stream, file.FileType ?? "application/octet-stream");
            }
            if (file.StorageProvider == "local" && file.LocalPath is not null && System.IO.File.Exists(file.LocalPath))
            {
                var stream = System.IO.File.OpenRead(file.LocalPath);
                return Results.File(stream, file.FileType ?? "application/octet-stream");
            }
            return Results.NotFound("File not found");
        });

        group.MapGet("/course/{courseId:int}", async (int courseId, IFileRepository repo) =>
        {
            var files = await repo.GetFilesForCourseAsync(courseId);
            return files.Select(f => new FileAssetDto(
                f.FileAssetId, f.FileName, f.LocalPath, f.CloudPath,
                f.StorageProvider, f.FileType, f.FileSize, f.UploadedAt));
        });

        group.MapGet("/course-section/{courseSectionId:int}", async (int courseSectionId, IFileRepository repo) =>
        {
            var files = await repo.GetFilesForCourseSectionAsync(courseSectionId);
            return files.Select(f => new FileAssetDto(
                f.FileAssetId, f.FileName, f.LocalPath, f.CloudPath,
                f.StorageProvider, f.FileType, f.FileSize, f.UploadedAt));
        });

        group.MapGet("/group/{groupId:int}", async (int groupId, IFileRepository repo) =>
        {
            var files = await repo.GetFilesForGroupAsync(groupId);
            return files.Select(f => new FileAssetDto(
                f.FileAssetId, f.FileName, f.LocalPath, f.CloudPath,
                f.StorageProvider, f.FileType, f.FileSize, f.UploadedAt));
        });

        group.MapGet("/person/{personId:int}", async (int personId, IFileRepository repo) =>
        {
            var files = await repo.GetFilesForPersonAsync(personId);
            return files.Select(f => new FileAssetDto(
                f.FileAssetId, f.FileName, f.LocalPath, f.CloudPath,
                f.StorageProvider, f.FileType, f.FileSize, f.UploadedAt));
        });

        group.MapGet("/download/{entityType}/{entityId:int}", async (
            string entityType, int entityId, AppDbContext db,
            IFileRepository repo, BlobService blob) =>
        {
            using var memoryStream = new MemoryStream();
            entityType = entityType.ToLower();

            using (var zip = new ZipArchive(memoryStream, ZipArchiveMode.Create, true))
            {
                switch (entityType)
                {
                    case "course":
                        await AddCourseToZip(zip, entityId, db, repo, blob);
                        break;
                    case "course-section":
                        await AddCourseSectionToZip(zip, entityId, db, repo, blob);
                        break;
                    case "group":
                        await AddGroupToZip(zip, entityId, db, repo, blob);
                        break;
                    case "person":
                        await AddPersonToZip(zip, entityId, db, repo, blob);
                        break;
                    default:
                        return Results.BadRequest("Invalid entity type. Use: course, course-section, group, person.");
                }
            }

            return Results.File(memoryStream.ToArray(), "application/zip", $"{entityType}-{entityId}.zip");
        });

        group.MapDelete("/course/{courseId:int}/{fileAssetId:int}", async (int courseId, int fileAssetId, IFileRepository repo) =>
        {
            var ok = await repo.RemoveFileFromCourseAsync(courseId, fileAssetId);
            return ok ? Results.NoContent() : Results.NotFound();
        });

        group.MapDelete("/course-section/{sectionId:int}/{fileAssetId:int}", async (int sectionId, int fileAssetId, IFileRepository repo) =>
        {
            var ok = await repo.RemoveFileFromCourseSectionAsync(sectionId, fileAssetId);
            return ok ? Results.NoContent() : Results.NotFound();
        });

        group.MapDelete("/group/{groupId:int}/{fileAssetId:int}", async (int groupId, int fileAssetId, IFileRepository repo) =>
        {
            var ok = await repo.RemoveFileFromGroupAsync(groupId, fileAssetId);
            return ok ? Results.NoContent() : Results.NotFound();
        });

        group.MapDelete("/person/{personId:int}/{fileAssetId:int}", async (int personId, int fileAssetId, IFileRepository repo) =>
        {
            var ok = await repo.RemoveFileFromPersonAsync(personId, fileAssetId);
            return ok ? Results.NoContent() : Results.NotFound();
        });

        return routes;
    }

    static string SanitizeFolderName(string name)
    {
        if (string.IsNullOrWhiteSpace(name)) return "Unknown";
        var invalid = Path.GetInvalidFileNameChars();
        var chars = name.ToCharArray();
        for (int i = 0; i < chars.Length; i++)
            if (Array.IndexOf(invalid, chars[i]) >= 0) chars[i] = '_';
        var sanitized = new string(chars).Trim();
        return string.IsNullOrWhiteSpace(sanitized) ? "Unknown" : sanitized;
    }

    static async Task WriteFileToZip(ZipArchive zip, IFileRepository repo, BlobService blob, int fileId, string folder)
    {
        try
        {
            var file = await repo.GetByIdAsync(fileId);
            if (file is null) return;
            var entry = zip.CreateEntry($"{folder}{file.FileName}");
            await using var entryStream = entry.Open();
            if (file.StorageProvider == "azure")
            {
                var stream = await blob.DownloadAsync(file.FileName);
                await stream.CopyToAsync(entryStream);
            }
            else if (file.StorageProvider == "local" && file.LocalPath != null && File.Exists(file.LocalPath))
            {
                await using var fileStream = new FileStream(file.LocalPath, FileMode.Open, FileAccess.Read);
                await fileStream.CopyToAsync(entryStream);
            }
        }
        catch (Exception ex)
        {
            Console.Error.WriteLine($"Skipping file {fileId} in ZIP: {ex.Message}");
        }
    }

    static async Task AddCourseToZip(ZipArchive zip, int courseId, AppDbContext db, IFileRepository repo, BlobService blob)
    {
        var course = await db.Courses
            .Include(c => c.CourseFiles)
            .Include(c => c.CourseSections).ThenInclude(cs => cs.CourseSectionFiles)
            .Include(c => c.CourseSections).ThenInclude(cs => cs.Groups).ThenInclude(g => g.GroupFiles)
            .Include(c => c.CourseSections).ThenInclude(cs => cs.Groups).ThenInclude(g => g.GroupPeople).ThenInclude(gp => gp.Person)
            .Include(c => c.CoursePeople).ThenInclude(cp => cp.Person)
            .AsSplitQuery()
            .FirstOrDefaultAsync(c => c.CourseId == courseId);
        if (course is null) return;

        var coursePath = SanitizeFolderName(course.Name) + "/";

        foreach (var cf in course.CourseFiles)
            await WriteFileToZip(zip, repo, blob, cf.FileAssetId, coursePath);

        foreach (var section in course.CourseSections)
        {
            var sectionPath = $"{coursePath}Sections/{SanitizeFolderName(section.Name)}/";
            foreach (var sf in section.CourseSectionFiles)
                await WriteFileToZip(zip, repo, blob, sf.FileAssetId, sectionPath);

            foreach (var group in section.Groups)
            {
                var groupPath = $"{sectionPath}{SanitizeFolderName(group.Name)}/";
                foreach (var gf in group.GroupFiles)
                    await WriteFileToZip(zip, repo, blob, gf.FileAssetId, groupPath);
            }
        }

        var personIds = new HashSet<int>();
        foreach (var cp in course.CoursePeople)
            if (cp.Person is not null) personIds.Add(cp.PersonId);
        foreach (var section in course.CourseSections)
            foreach (var group in section.Groups)
                foreach (var gp in group.GroupPeople)
                    if (gp.Person is not null) personIds.Add(gp.PersonId);

        if (personIds.Count > 0)
        {
            var peopleRoot = $"{coursePath}People/";
            zip.CreateEntry(peopleRoot);
            foreach (var personId in personIds)
            {
                var person = await db.People.FindAsync(personId);
                if (person is null) continue;
                var personPath = $"{peopleRoot}{SanitizeFolderName(person.FullName)}/";
                zip.CreateEntry(personPath);
                var files = await repo.GetFilesForPersonAsync(personId);
                foreach (var file in files)
                    await WriteFileToZip(zip, repo, blob, file.FileAssetId, personPath);
            }
        }
    }

    static async Task AddCourseSectionToZip(ZipArchive zip, int sectionId, AppDbContext db, IFileRepository repo, BlobService blob)
    {
        var section = await db.CourseSections
            .Include(s => s.CourseSectionFiles)
            .Include(s => s.Groups).ThenInclude(g => g.GroupFiles)
            .Include(s => s.CourseSectionPeople).ThenInclude(sp => sp.Person)
            .Include(s => s.Groups).ThenInclude(g => g.GroupPeople).ThenInclude(gp => gp.Person)
            .AsSplitQuery()
            .FirstOrDefaultAsync(s => s.CourseSectionId == sectionId);
        if (section is null) return;

        var sectionPath = SanitizeFolderName(section.Name) + "/";

        foreach (var sf in section.CourseSectionFiles)
            await WriteFileToZip(zip, repo, blob, sf.FileAssetId, sectionPath);

        foreach (var group in section.Groups)
        {
            var groupPath = $"{sectionPath}{SanitizeFolderName(group.Name)}/";
            foreach (var gf in group.GroupFiles)
                await WriteFileToZip(zip, repo, blob, gf.FileAssetId, groupPath);

            foreach (var gp in group.GroupPeople)
            {
                if (gp.Person is null) continue;
                var personPath = $"{groupPath}{SanitizeFolderName(gp.Person.FullName)}/";
                zip.CreateEntry(personPath);
                var files = await repo.GetFilesForPersonAsync(gp.PersonId);
                foreach (var file in files)
                    await WriteFileToZip(zip, repo, blob, file.FileAssetId, personPath);
            }
        }

        if (section.CourseSectionPeople.Count > 0)
        {
            var peopleRoot = $"{sectionPath}People/";
            foreach (var sp in section.CourseSectionPeople)
            {
                if (sp.Person is null) continue;
                var personPath = $"{peopleRoot}{SanitizeFolderName(sp.Person.FullName)}/";
                var files = await repo.GetFilesForPersonAsync(sp.PersonId);
                foreach (var file in files)
                    await WriteFileToZip(zip, repo, blob, file.FileAssetId, personPath);
            }
        }
    }

    static async Task AddGroupToZip(ZipArchive zip, int groupId, AppDbContext db, IFileRepository repo, BlobService blob)
    {
        var group = await db.Groups
            .Include(g => g.GroupFiles)
            .Include(g => g.GroupPeople).ThenInclude(gp => gp.Person)
            .FirstOrDefaultAsync(g => g.GroupId == groupId);
        if (group is null) return;

        foreach (var gf in group.GroupFiles)
            await WriteFileToZip(zip, repo, blob, gf.FileAssetId, SanitizeFolderName(group.Name) + "/");

        foreach (var gp in group.GroupPeople)
        {
            if (gp.Person is null) continue;
            var files = await repo.GetFilesForPersonAsync(gp.PersonId);
            if (files.Count == 0) continue;
            foreach (var file in files)
                await WriteFileToZip(zip, repo, blob, file.FileAssetId, SanitizeFolderName(gp.Person.FullName) + "/");
        }
    }

    static async Task AddPersonToZip(ZipArchive zip, int personId, AppDbContext db, IFileRepository repo, BlobService blob)
    {
        var person = await db.People.Include(p => p.PersonFiles).FirstOrDefaultAsync(p => p.PersonId == personId);
        if (person is null) return;

        var personPath = SanitizeFolderName(person.FullName) + "/";
        zip.CreateEntry(personPath);
        foreach (var pf in person.PersonFiles)
            await WriteFileToZip(zip, repo, blob, pf.FileAssetId, personPath);
    }
}