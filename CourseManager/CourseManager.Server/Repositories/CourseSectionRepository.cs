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

    public async Task<List<CourseSection>> GetAllAsync(int userId)
    {
        return await _db.CourseSections
            .Where(s => s.Course.UserId == userId)
            .ToListAsync();
    }

    public async Task<CourseSection?> GetByIdAsync(int courseSectionId, int userId)
    {
        return await _db.CourseSections
            .FirstOrDefaultAsync(s => s.CourseSectionId == courseSectionId && s.Course.UserId == userId);
    }

    public async Task<List<CourseSection>> GetByCourseIdAsync(int courseId, int userId)
    {
        return await _db.CourseSections
            .Where(s => s.CourseId == courseId && s.Course.UserId == userId)
            .ToListAsync();
    }

    public async Task<CourseSection> CreateAsync(CourseSection section)
    {
        _db.CourseSections.Add(section);
        await _db.SaveChangesAsync();
        return section;
    }

    public async Task<CourseSection?> UpdateAsync(int courseSectionId, CourseSection updated, int userId)
    {
        var existing = await _db.CourseSections
            .FirstOrDefaultAsync(s => s.CourseSectionId == courseSectionId && s.Course.UserId == userId);
        if (existing is null)
            return null;

        existing.Name = updated.Name;
        existing.Description = updated.Description;
        existing.StartDate = updated.StartDate;
        existing.EndDate = updated.EndDate;

        await _db.SaveChangesAsync();
        return existing;
    }

    public async Task<bool> DeleteAsync(int courseSectionId, int userId)
    {
        var section = await _db.CourseSections
            .FirstOrDefaultAsync(s => s.CourseSectionId == courseSectionId && s.Course.UserId == userId);
        if (section is null)
            return false;

        _db.CourseSections.Remove(section);
        await _db.SaveChangesAsync();
        return true;
    }
}