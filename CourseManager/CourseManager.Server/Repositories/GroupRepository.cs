using CourseManager.Server.Data;
using CourseManager.Server.Models;
using Microsoft.EntityFrameworkCore;

namespace CourseManager.Server.Repositories;

public class GroupRepository : IGroupRepository
{
    private readonly AppDbContext _db;

    public GroupRepository(AppDbContext db)
    {
        _db = db;
    }

    public async Task<List<Group>> GetAllAsync(int userId)
    {
        return await _db.Groups
            .Where(g => g.CourseSection.Course.UserId == userId)
            .ToListAsync();
    }

    public async Task<Group?> GetByIdAsync(int groupId, int userId)
    {
        return await _db.Groups
            .FirstOrDefaultAsync(g => g.GroupId == groupId && g.CourseSection.Course.UserId == userId);
    }

    public async Task<List<Group>> GetByCourseSectionIdAsync(int courseSectionId, int userId)
    {
        return await _db.Groups
            .Where(g => g.CourseSectionId == courseSectionId && g.CourseSection.Course.UserId == userId)
            .ToListAsync();
    }

    public async Task<Group> CreateAsync(Group group)
    {
        _db.Groups.Add(group);
        await _db.SaveChangesAsync();
        return group;
    }

    public async Task<Group?> UpdateAsync(int groupId, Group updated, int userId)
    {
        var existing = await _db.Groups
            .FirstOrDefaultAsync(g => g.GroupId == groupId && g.CourseSection.Course.UserId == userId);
        if (existing is null)
            return null;

        existing.Name = updated.Name;

        await _db.SaveChangesAsync();
        return existing;
    }

    public async Task<bool> DeleteAsync(int groupId, int userId)
    {
        var group = await _db.Groups
            .FirstOrDefaultAsync(g => g.GroupId == groupId && g.CourseSection.Course.UserId == userId);
        if (group is null)
            return false;

        _db.Groups.Remove(group);
        await _db.SaveChangesAsync();
        return true;
    }
}