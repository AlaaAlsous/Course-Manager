using CourseManager.Server.Models;

namespace CourseManager.Server.Repositories;

public interface IFileRepository
{
    Task<FileAsset> CreateAsync(FileAsset file);
    Task<FileAsset?> GetByIdAsync(int fileAssetId, int userId);
    Task<bool> DeleteAsync(int fileAssetId, int userId);

    Task<string?> ReadFileContentAsync(int fileAssetId, int userId);
    Task<bool> WriteFileContentAsync(int fileAssetId, string content, int userId);

    Task<List<FileAsset>> GetFilesForCourseAsync(int courseId, int userId);
    Task<List<FileAsset>> GetFilesForCourseSectionAsync(int courseSectionId, int userId);
    Task<List<FileAsset>> GetFilesForGroupAsync(int groupId, int userId);
    Task<List<FileAsset>> GetFilesForPersonAsync(int personId, int userId);

    Task AddToCourseAsync(int courseId, int fileAssetId);
    Task AddToCourseSectionAsync(int courseSectionId, int fileAssetId);
    Task AddToGroupAsync(int groupId, int fileAssetId);
    Task AddToPersonAsync(int personId, int fileAssetId);

    Task<bool> RemoveFileFromCourseAsync(int courseId, int fileAssetId, int userId);
    Task<bool> RemoveFileFromCourseSectionAsync(int courseSectionId, int fileAssetId, int userId);
    Task<bool> RemoveFileFromGroupAsync(int groupId, int fileAssetId, int userId);
    Task<bool> RemoveFileFromPersonAsync(int personId, int fileAssetId, int userId);
}