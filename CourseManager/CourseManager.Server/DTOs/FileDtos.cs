namespace CourseManager.Server.DTOs;

public record FileAssetDto(
    int FileAssetId,
    string FileName,
    string LocalPath,
    string? CloudPath,
    string StorageProvider,
    string FileType,
    long FileSize,
    DateTime UploadedAt
);

public record CreateFileAssetRequest(
    string FileName,
    string LocalPath,
    string? CloudPath,
    string StorageProvider,
    string FileType,
    long FileSize
);

public record CreateOrUploadFileRequest(
    string? FileName,
    string? Content
);


public record UpdateFileContentRequest(string Content);

public record CourseFileDto(int CourseId, int FileAssetId);
public record CourseSectionFileDto(int CourseSectionId, int FileAssetId);
public record GroupFileDto(int GroupId, int FileAssetId);
public record PersonFileDto(int PersonId, int FileAssetId);
