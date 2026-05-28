using CourseManager.Server.Models;

public interface ICourseRepository
{
    Task<List<Course>> GetAllAsync();
    Task<Course?> GetByIdAsync(int id);
    Task<Course> CreateAsync(Course course);
    Task<Course?> UpdateAsync(int id, Course updated);
    Task<bool> DeleteAsync(int id);
}
