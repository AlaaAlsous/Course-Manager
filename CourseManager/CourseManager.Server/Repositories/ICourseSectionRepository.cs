using CourseManager.Server.Models;

namespace CourseManager.Server.Repositories;

public interface ICourseSectionRepository
{
    Task<List<CourseSection>> GetAllAsync();
    Task<CourseSection?> GetByIdAsync(int id);
    Task<CourseSection> CreateAsync(CourseSection section);
    Task<CourseSection?> UpdateAsync(int id, CourseSection updated);
    Task<bool> DeleteAsync(int id);
    Task<List<CourseSection>> GetByCourseIdAsync(int courseId);
}
