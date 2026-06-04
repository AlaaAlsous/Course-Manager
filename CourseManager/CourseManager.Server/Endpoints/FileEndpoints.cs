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
          AppDbContext db,
          IFileRepository repo,
          BlobService blobService,
          IConfiguration config) =>
      {
          var type = entityType.ToLower();
          if (type is not ("course" or "section" or "coursesection" or "group" or "person"))
              return Results.BadRequest("Invalid entity type. Use: course, section, group, person.");

          var entityExists = type switch
          {
              "course" => await db.Courses.AnyAsync(c => c.CourseId == entityId),
              "section" => await db.CourseSections.AnyAsync(s => s.CourseSectionId == entityId),
              "coursesection" => await db.CourseSections.AnyAsync(s => s.CourseSectionId == entityId),
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

          var allowedMimeTypes = new[]
          {
        "image/png",
        "image/jpeg",
        "image/jpg",
        "application/pdf",
        "text/plain"
          };

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

        group.MapGet("/{fileAssetId:int}/download", async (
            int fileAssetId,
            IFileRepository repo,
            BlobService blobService) =>
        {
            var file = await repo.GetByIdAsync(fileAssetId);
            if (file is null)
                return Results.NotFound("File not found");

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

            return Results.NotFound("File content not found on disk or blob storage");
        });

        group.MapGet("/{fileAssetId:int}/inline", async (
            int fileAssetId,
            IFileRepository repo,
            BlobService blobService) =>
        {
            var file = await repo.GetByIdAsync(fileAssetId);
            if (file is null)
                return Results.NotFound("File not found");

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

            return Results.NotFound("File content not found on disk or blob storage");
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

        group.MapGet("/download/{entityType}/{entityId:int}", async (
            string entityType,
            int entityId,
            AppDbContext db,
            IFileRepository repo,
            BlobService blob) =>
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
                            await AddFileToZip(zip, repo, blob, cf.FileAssetId, "Course/");

                        foreach (var section in course.CourseSections)
                            foreach (var sf in section.CourseSectionFiles)
                                await AddFileToZip(zip, repo, blob, sf.FileAssetId, "Course/CourseSections/");

                        foreach (var section in course.CourseSections)
                            foreach (var groupEntity in section.Groups)
                                foreach (var gf in groupEntity.GroupFiles)
                                    await AddFileToZip(zip, repo, blob, gf.FileAssetId, "Course/Groups/");

                        foreach (var cp in course.CoursePeople)
                        {
                            var personFiles = await repo.GetFilesForPersonAsync(cp.PersonId);
                            foreach (var file in personFiles)
                                await AddFileToZip(zip, repo, blob, file.FileAssetId, "Course/People/");
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
                            await AddFileToZip(zip, repo, blob, sf.FileAssetId, "CourseSection/");

                        foreach (var groupEntity in section.Groups)
                            foreach (var gf in groupEntity.GroupFiles)
                                await AddFileToZip(zip, repo, blob, gf.FileAssetId, "CourseSection/Groups/");

                        foreach (var sp in section.CourseSectionPeople)
                        {
                            var personFiles = await repo.GetFilesForPersonAsync(sp.PersonId);
                            foreach (var file in personFiles)
                                await AddFileToZip(zip, repo, blob, file.FileAssetId, "CourseSection/People/");
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
                            await AddFileToZip(zip, repo, blob, gf.FileAssetId, "Group/");

                        foreach (var gp in groupEntity.GroupPeople)
                        {
                            var personFiles = await repo.GetFilesForPersonAsync(gp.PersonId);
                            foreach (var file in personFiles)
                                await AddFileToZip(zip, repo, blob, file.FileAssetId, "Group/People/");
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
                            await AddFileToZip(zip, repo, blob, pf.FileAssetId, "Person/");

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
        });

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

    static async Task AddFileToZip(ZipArchive zip, IFileRepository repo, BlobService blob, int fileId, string folder)
    {
        var file = await repo.GetByIdAsync(fileId);
        if (file is null)
            return;

        var entry = zip.CreateEntry($"{folder}{file.FileName}");
        using var entryStream = entry.Open();

        if (file.StorageProvider == "azure")
        {
            var stream = await blob.DownloadAsync(file.FileName);
            await stream.CopyToAsync(entryStream);
        }
        else if (file.StorageProvider == "local" && file.LocalPath != null && File.Exists(file.LocalPath))
        {
            using var fileStream = new FileStream(file.LocalPath, FileMode.Open, FileAccess.Read);
            await fileStream.CopyToAsync(entryStream);
        }
    }
}
