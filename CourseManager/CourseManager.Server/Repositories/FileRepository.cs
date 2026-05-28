using CourseManager.Server.Data;
using CourseManager.Server.Models;
using Microsoft.EntityFrameworkCore;

namespace CourseManager.Server.Repositories;

public class FileRepository : IFileRepository
{
    private readonly AppDbContext _db;

    public FileRepository(AppDbContext db)
    {
        _db = db;
    }

    public async Task<FileAsset> CreateAsync(FileAsset file)
    {
        _db.FileAssets.Add(file);
        await _db.SaveChangesAsync();
        return file;
    }

    public async Task<FileAsset?> GetByIdAsync(int fileAssetId)
    {
        return await _db.FileAssets.FindAsync(fileAssetId);
    }

    public async Task<bool> DeleteAsync(int fileAssetId)
    {
        var file = await _db.FileAssets.FindAsync(fileAssetId);
        if (file is null)
            return false;

        _db.FileAssets.Remove(file);
        await _db.SaveChangesAsync();
        return true;
    }

    public async Task<string?> ReadFileContentAsync(int fileAssetId)
    {
        var file = await _db.FileAssets.FindAsync(fileAssetId);
        if (file is null || !System.IO.File.Exists(file.LocalPath))
            return null;

        return await System.IO.File.ReadAllTextAsync(file.LocalPath);
    }

    public async Task<bool> WriteFileContentAsync(int fileAssetId, string content)
    {
        var file = await _db.FileAssets.FindAsync(fileAssetId);
        if (file is null || !System.IO.File.Exists(file.LocalPath))
            return false;

        await System.IO.File.WriteAllTextAsync(file.LocalPath, content);

        var info = new FileInfo(file.LocalPath);
        file.FileSize = info.Length;
        await _db.SaveChangesAsync();

        return true;
    }

    public async Task<List<FileAsset>> GetFilesForCourseAsync(int courseId)
    {
        return await _db.CourseFiles
            .Where(cf => cf.CourseId == courseId)
            .Select(cf => cf.FileAsset)
            .ToListAsync();
    }

    public async Task<List<FileAsset>> GetFilesForCourseSectionAsync(int courseSectionId)
    {
        return await _db.CourseSectionFiles
            .Where(cf => cf.CourseSectionId == courseSectionId)
            .Select(cf => cf.FileAsset)
            .ToListAsync();
    }

    public async Task<List<FileAsset>> GetFilesForGroupAsync(int groupId)
    {
        return await _db.GroupFiles
            .Where(gf => gf.GroupId == groupId)
            .Select(gf => gf.FileAsset)
            .ToListAsync();
    }

    public async Task<List<FileAsset>> GetFilesForPersonAsync(int personId)
    {
        return await _db.PersonFiles
            .Where(pf => pf.PersonId == personId)
            .Select(pf => pf.FileAsset)
            .ToListAsync();
    }

    public async Task AddToCourseAsync(int courseId, int fileAssetId)
    {
        _db.CourseFiles.Add(new CourseFile { CourseId = courseId, FileAssetId = fileAssetId });
        await _db.SaveChangesAsync();
    }

    public async Task AddToCourseSectionAsync(int courseSectionId, int fileAssetId)
    {
        _db.CourseSectionFiles.Add(new CourseSectionFile { CourseSectionId = courseSectionId, FileAssetId = fileAssetId });
        await _db.SaveChangesAsync();
    }

    public async Task AddToGroupAsync(int groupId, int fileAssetId)
    {
        _db.GroupFiles.Add(new GroupFile { GroupId = groupId, FileAssetId = fileAssetId });
        await _db.SaveChangesAsync();
    }

    public async Task AddToPersonAsync(int personId, int fileAssetId)
    {
        _db.PersonFiles.Add(new PersonFile { PersonId = personId, FileAssetId = fileAssetId });
        await _db.SaveChangesAsync();
    }
}
