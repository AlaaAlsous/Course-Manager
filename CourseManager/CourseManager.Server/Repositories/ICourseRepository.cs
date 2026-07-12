using CourseManager.Server.Models;

public interface ICourseRepository
{
    Task<List<Course>> GetAllAsync(int userId);
    Task<Course?> GetByIdAsync(int id, int userId);
    Task<Course> CreateAsync(Course course);
    Task<Course?> UpdateAsync(int id, Course updated, int userId);
    Task<bool> DeleteAsync(int id, int userId);
}