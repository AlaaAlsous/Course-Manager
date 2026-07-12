using CourseManager.Server.Models;

namespace CourseManager.Server.Repositories;

public interface IPersonRepository
{
    Task<List<Person>> GetAllAsync(int userId);
    Task<Person?> GetByIdAsync(int personId, int userId);
    Task<Person?> GetByNameAsync(string name, int userId);
    Task<Person> CreateAsync(Person person);
    Task<Person?> UpdateAsync(int personId, Person updated, int userId);
    Task<bool> DeleteAsync(int personId, int userId);
}