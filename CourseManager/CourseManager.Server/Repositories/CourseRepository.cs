using CourseManager.Server.Data;
using CourseManager.Server.Models;
using Microsoft.EntityFrameworkCore;

namespace CourseManager.Server.Repositories;

public class CourseRepository : ICourseRepository
{
    private readonly AppDbContext _db;

    public CourseRepository(AppDbContext db)
    {
        _db = db;
    }

    public async Task<List<Course>> GetAllAsync(int userId)
    {
        return await _db.Courses
            .Where(c => c.UserId == userId)
            .ToListAsync();
    }

    public async Task<Course?> GetByIdAsync(int courseId, int userId)
    {
        return await _db.Courses
            .FirstOrDefaultAsync(c => c.CourseId == courseId && c.UserId == userId);
    }

    public async Task<Course> CreateAsync(Course course)
    {
        _db.Courses.Add(course);
        await _db.SaveChangesAsync();
        return course;
    }

    public async Task<Course?> UpdateAsync(int courseId, Course updated, int userId)
    {
        var existing = await _db.Courses
            .FirstOrDefaultAsync(c => c.CourseId == courseId && c.UserId == userId);
        if (existing is null)
            return null;

        existing.Name = updated.Name;
        existing.Description = updated.Description;

        await _db.SaveChangesAsync();
        return existing;
    }

    public async Task<bool> DeleteAsync(int courseId, int userId)
    {
        var course = await _db.Courses
            .FirstOrDefaultAsync(c => c.CourseId == courseId && c.UserId == userId);
        if (course is null)
            return false;

        _db.Courses.Remove(course);
        await _db.SaveChangesAsync();
        return true;
    }
}