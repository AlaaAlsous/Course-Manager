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

    public async Task<List<Course>> GetAllAsync()
    {
        return await _db.Courses.ToListAsync();
    }

    public async Task<Course?> GetByIdAsync(int courseId)
    {
        return await _db.Courses.FindAsync(courseId);
    }

    public async Task<Course> CreateAsync(Course course)
    {
        _db.Courses.Add(course);
        await _db.SaveChangesAsync();
        return course;
    }

    public async Task<Course?> UpdateAsync(int courseId, Course updated)
    {
        var existing = await _db.Courses.FindAsync(courseId);
        if (existing is null)
            return null;

        existing.Name = updated.Name;
        existing.Description = updated.Description;

        await _db.SaveChangesAsync();
        return existing;
    }

    public async Task<bool> DeleteAsync(int courseId)
    {
        var course = await _db.Courses.FindAsync(courseId);
        if (course is null)
            return false;

        _db.Courses.Remove(course);
        await _db.SaveChangesAsync();
        return true;
    }
}
