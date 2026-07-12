using CourseManager.Server.Models;

namespace CourseManager.Server.Repositories;

public interface ICourseSectionRepository
{
    Task<List<CourseSection>> GetAllAsync(int userId);
    Task<CourseSection?> GetByIdAsync(int courseSectionId, int userId);
    Task<List<CourseSection>> GetByCourseIdAsync(int courseId, int userId);
    Task<CourseSection> CreateAsync(CourseSection section);
    Task<CourseSection?> UpdateAsync(int courseSectionId, CourseSection updated, int userId);
    Task<bool> DeleteAsync(int courseSectionId, int userId);
}