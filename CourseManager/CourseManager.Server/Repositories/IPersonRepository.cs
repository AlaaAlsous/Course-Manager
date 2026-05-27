using CourseManager.Server.Models;

namespace CourseManager.Server.Repositories;

public interface IPersonRepository
{
    Task<List<Person>> GetAllAsync();
    Task<Person?> GetByIdAsync(int personId);
    Task<Person> CreateAsync(Person person);
    Task<Person?> UpdateAsync(int personId, Person updated);
    Task<bool> DeleteAsync(int personId);
}
