using CourseManager.Server.Models;

namespace CourseManager.Server.Repositories;

public interface ICourseSectionRepository
{
    Task<List<CourseSection>> GetAllAsync();
    Task<CourseSection?> GetByIdAsync(int courseSectionId);
    Task<List<CourseSection>> GetByCourseIdAsync(int courseId);
    Task<CourseSection> CreateAsync(CourseSection section);
    Task<CourseSection?> UpdateAsync(int courseSectionId, CourseSection updated);
    Task<bool> DeleteAsync(int courseSectionId);
}
