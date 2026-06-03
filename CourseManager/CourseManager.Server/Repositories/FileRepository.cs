using CourseManager.Server.Data;
using CourseManager.Server.Models;
using Microsoft.EntityFrameworkCore;

namespace CourseManager.Server.Repositories;

public class FileRepository : IFileRepository
{
    private readonly AppDbContext _db;
    private readonly BlobService _blob;

    public FileRepository(AppDbContext db, BlobService blob)
    {
        _db = db;
        _blob = blob;
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
        var file = await _db.FileAssets
            .Include(f => f.CourseFiles)
            .Include(f => f.CourseSectionFiles)
            .Include(f => f.GroupFiles)
            .Include(f => f.PersonFiles)
            .FirstOrDefaultAsync(f => f.FileAssetId == fileAssetId);

        if (file == null)
            return false;

        if (file.CourseFiles != null)
            _db.CourseFiles.RemoveRange(file.CourseFiles);

        if (file.CourseSectionFiles != null)
            _db.CourseSectionFiles.RemoveRange(file.CourseSectionFiles);

        if (file.GroupFiles != null)
            _db.GroupFiles.RemoveRange(file.GroupFiles);

        if (file.PersonFiles != null)
            _db.PersonFiles.RemoveRange(file.PersonFiles);

        if (file.StorageProvider == "azure" && file.FileName != null)
        {
            await _blob.DeleteAsync(file.FileName);
        }
        if (file.StorageProvider == "local" && file.LocalPath != null)
        {
            if (System.IO.File.Exists(file.LocalPath))
                System.IO.File.Delete(file.LocalPath);
        }

        _db.FileAssets.Remove(file);

        await _db.SaveChangesAsync();
        return true;
    }

    public async Task<string?> ReadFileContentAsync(int fileAssetId)
    {
        var file = await _db.FileAssets.FindAsync(fileAssetId);
        if (file is null)
            return null;

        if (file.StorageProvider == "azure")
        {
            var stream = await _blob.DownloadAsync(file.FileName);
            using var reader = new StreamReader(stream);
            return await reader.ReadToEndAsync();
        }

        if (file.StorageProvider == "local" && System.IO.File.Exists(file.LocalPath))
            return await System.IO.File.ReadAllTextAsync(file.LocalPath);

        return null;
    }

    public async Task<bool> WriteFileContentAsync(int fileAssetId, string content)
    {
        var file = await _db.FileAssets.FindAsync(fileAssetId);
        if (file is null)
            return false;

        if (file.StorageProvider == "azure")
        {
            using var mem = new MemoryStream(System.Text.Encoding.UTF8.GetBytes(content));
            await _blob.UploadAsync(file.FileName, mem);

            file.FileSize = mem.Length;
            await _db.SaveChangesAsync();
            return true;
        }

        if (file.StorageProvider == "local" && System.IO.File.Exists(file.LocalPath))
        {
            await System.IO.File.WriteAllTextAsync(file.LocalPath, content);

            var info = new FileInfo(file.LocalPath);
            file.FileSize = info.Length;
            await _db.SaveChangesAsync();
            return true;
        }

        return false;
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

    public async Task<bool> RemoveFileFromCourseAsync(int courseId, int fileAssetId)
    {
        var relation = await _db.CourseFiles
            .FirstOrDefaultAsync(cf => cf.CourseId == courseId && cf.FileAssetId == fileAssetId);

        if (relation == null)
            return false;

        _db.CourseFiles.Remove(relation);
        await _db.SaveChangesAsync();
        return true;
    }

    public async Task<bool> RemoveFileFromCourseSectionAsync(int sectionId, int fileAssetId)
    {
        var relation = await _db.CourseSectionFiles
            .FirstOrDefaultAsync(sf => sf.CourseSectionId == sectionId && sf.FileAssetId == fileAssetId);

        if (relation == null)
            return false;

        _db.CourseSectionFiles.Remove(relation);
        await _db.SaveChangesAsync();
        return true;
    }

    public async Task<bool> RemoveFileFromGroupAsync(int groupId, int fileAssetId)
    {
        var relation = await _db.GroupFiles
            .FirstOrDefaultAsync(gf => gf.GroupId == groupId && gf.FileAssetId == fileAssetId);

        if (relation == null)
            return false;

        _db.GroupFiles.Remove(relation);
        await _db.SaveChangesAsync();
        return true;
    }

    public async Task<bool> RemoveFileFromPersonAsync(int personId, int fileAssetId)
    {
        var relation = await _db.PersonFiles
            .FirstOrDefaultAsync(pf => pf.PersonId == personId && pf.FileAssetId == fileAssetId);

        if (relation == null)
            return false;

        _db.PersonFiles.Remove(relation);
        await _db.SaveChangesAsync();
        return true;
    }
}
