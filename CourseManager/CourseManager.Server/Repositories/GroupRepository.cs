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

    public async Task<List<Group>> GetAllAsync()
    {
        return await _db.Groups.ToListAsync();
    }

    public async Task<Group?> GetByIdAsync(int groupId)
    {
        return await _db.Groups.FindAsync(groupId);
    }

    public async Task<List<Group>> GetByCourseSectionIdAsync(int courseSectionId)
    {
        return await _db.Groups
            .Where(g => g.CourseSectionId == courseSectionId)
            .ToListAsync();
    }

    public async Task<Group> CreateAsync(Group group)
    {
        _db.Groups.Add(group);
        await _db.SaveChangesAsync();
        return group;
    }

    public async Task<Group?> UpdateAsync(int groupId, Group updated)
    {
        var existing = await _db.Groups.FindAsync(groupId);
        if (existing is null)
            return null;

        existing.Name = updated.Name;

        await _db.SaveChangesAsync();
        return existing;
    }

    public async Task<bool> DeleteAsync(int groupId)
    {
        var group = await _db.Groups.FindAsync(groupId);
        if (group is null)
            return false;

        _db.Groups.Remove(group);
        await _db.SaveChangesAsync();
        return true;
    }
}
