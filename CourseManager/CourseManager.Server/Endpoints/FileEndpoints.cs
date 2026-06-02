using CourseManager.Server.DTOs;
using CourseManager.Server.Models;
using CourseManager.Server.Repositories;

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
}
