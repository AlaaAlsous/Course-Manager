using CourseManager.Server.Models;

namespace CourseManager.Server.Repositories;

public interface IGroupRepository
{
    Task<List<Group>> GetAllAsync(int userId);
    Task<Group?> GetByIdAsync(int groupId, int userId);
    Task<List<Group>> GetByCourseSectionIdAsync(int courseSectionId, int userId);
    Task<Group> CreateAsync(Group group);
    Task<Group?> UpdateAsync(int groupId, Group updated, int userId);
    Task<bool> DeleteAsync(int groupId, int userId);
}