using CourseManager.Server.Models;

namespace CourseManager.Server.Repositories;

public interface IFileRepository
{
    Task<FileAsset> CreateAsync(FileAsset file);
    Task<FileAsset?> GetByIdAsync(int fileAssetId);
    Task<bool> DeleteAsync(int fileAssetId);

    Task<string?> ReadFileContentAsync(int fileAssetId);
    Task<bool> WriteFileContentAsync(int fileAssetId, string content);

    Task<List<FileAsset>> GetFilesForCourseAsync(int courseId);
    Task<List<FileAsset>> GetFilesForCourseSectionAsync(int courseSectionId);
    Task<List<FileAsset>> GetFilesForGroupAsync(int groupId);
    Task<List<FileAsset>> GetFilesForPersonAsync(int personId);

    Task AddToCourseAsync(int courseId, int fileAssetId);
    Task AddToCourseSectionAsync(int courseSectionId, int fileAssetId);
    Task AddToGroupAsync(int groupId, int fileAssetId);
    Task AddToPersonAsync(int personId, int fileAssetId);
}
