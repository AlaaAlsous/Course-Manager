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

        group.MapPost("/create-or-upload", async (HttpRequest request, IFileRepository repo) =>
        {
            var uploadsPath = Path.Combine("uploads");
            Directory.CreateDirectory(uploadsPath);

            var form = await request.ReadFormAsync();
            var uploadedFile = form.Files.FirstOrDefault();

            if (uploadedFile is not null)
            {
                var timestamp = DateTime.UtcNow.ToString("yyyyMMdd_HHmmss");

                var originalName = Path.GetFileNameWithoutExtension(uploadedFile.FileName);
                var extension = Path.GetExtension(uploadedFile.FileName);

                var finalFileName = $"{originalName}_{timestamp}{extension}";
                var filePath = Path.Combine(uploadsPath, finalFileName);

                using (var stream = new FileStream(filePath, FileMode.Create))
                {
                    await uploadedFile.CopyToAsync(stream);
                }

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

            var body = await request.ReadFromJsonAsync<CreateOrUploadFileRequest>();

            if (body is null || string.IsNullOrWhiteSpace(body.FileName))
                return Results.BadRequest("Missing file name");

            var textFilePath = Path.Combine(uploadsPath, body.FileName);

            await System.IO.File.WriteAllTextAsync(textFilePath, body.Content ?? "");

            var textFileAsset = new FileAsset
            {
                FileName = body.FileName,
                LocalPath = textFilePath,
                CloudPath = null,
                StorageProvider = "local",
                FileType = "text/plain",
                FileSize = new FileInfo(textFilePath).Length
            };

            var createdText = await repo.CreateAsync(textFileAsset);

            return Results.Ok(new FileAssetDto(
                createdText.FileAssetId,
                createdText.FileName,
                createdText.LocalPath,
                createdText.CloudPath,
                createdText.StorageProvider,
                createdText.FileType,
                createdText.FileSize,
                createdText.UploadedAt
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

        return routes;
    }
}
