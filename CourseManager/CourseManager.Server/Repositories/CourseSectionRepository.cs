using CourseManager.Server.Data;
using CourseManager.Server.Models;
using Microsoft.EntityFrameworkCore;

namespace CourseManager.Server.Repositories;

public class CourseSectionRepository : ICourseSectionRepository
{
    private readonly AppDbContext _db;

    public CourseSectionRepository(AppDbContext db)
    {
        _db = db;
    }

    public async Task<List<CourseSection>> GetAllAsync()
    {
        return await _db.CourseSections.ToListAsync();
    }

    public async Task<CourseSection?> GetByIdAsync(int id)
    {
        return await _db.CourseSections.FindAsync(id);
    }

    public async Task<List<CourseSection>> GetByCourseIdAsync(int courseId)
    {
        return await _db.CourseSections
            .Where(s => s.CourseId == courseId)
            .ToListAsync();
    }

    public async Task<CourseSection> CreateAsync(CourseSection section)
    {
        _db.CourseSections.Add(section);
        await _db.SaveChangesAsync();
        return section;
    }

    public async Task<CourseSection?> UpdateAsync(int id, CourseSection updated)
    {
        var existing = await _db.CourseSections.FindAsync(id);
        if (existing is null)
            return null;

        existing.Name = updated.Name;

        await _db.SaveChangesAsync();
        return existing;
    }

    public async Task<bool> DeleteAsync(int id)
    {
        var section = await _db.CourseSections.FindAsync(id);
        if (section is null)
            return false;

        _db.CourseSections.Remove(section);
        await _db.SaveChangesAsync();
        return true;
    }
}
