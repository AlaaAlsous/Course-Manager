using CourseManager.Server.Models;

namespace CourseManager.Server.Repositories;

public interface IGroupRepository
{
    Task<List<Group>> GetAllAsync();
    Task<Group?> GetByIdAsync(int groupId);
    Task<List<Group>> GetByCourseSectionIdAsync(int courseSectionId);
    Task<Group> CreateAsync(Group group);
    Task<Group?> UpdateAsync(int groupId, Group updated);
    Task<bool> DeleteAsync(int groupId);
}
