using CourseManager.Server.Data;
using CourseManager.Server.Models;
using Microsoft.EntityFrameworkCore;

namespace CourseManager.Server.Repositories;

public class PersonRepository : IPersonRepository
{
    private readonly AppDbContext _db;

    public PersonRepository(AppDbContext db)
    {
        _db = db;
    }

    public async Task<List<Person>> GetAllAsync()
    {
        return await _db.People.ToListAsync();
    }

    public async Task<Person?> GetByIdAsync(int personId)
    {
        return await _db.People.FindAsync(personId);
    }

    public async Task<Person> CreateAsync(Person person)
    {
        _db.People.Add(person);
        await _db.SaveChangesAsync();
        return person;
    }

    public async Task<Person?> UpdateAsync(int personId, Person updated)
    {
        var existing = await _db.People.FindAsync(personId);
        if (existing is null)
            return null;

        existing.FullName = updated.FullName;

        await _db.SaveChangesAsync();
        return existing;
    }

    public async Task<bool> DeleteAsync(int personId)
    {
        var person = await _db.People.FindAsync(personId);
        if (person is null)
            return false;

        // Remove related join table records first to avoid FK conflicts
        var groupPeople = await _db.GroupPeople.Where(gp => gp.PersonId == personId).ToListAsync();
        _db.GroupPeople.RemoveRange(groupPeople);

        var coursePeople = await _db.CoursePeople.Where(cp => cp.PersonId == personId).ToListAsync();
        _db.CoursePeople.RemoveRange(coursePeople);

        var courseSectionPeople = await _db.CourseSectionPeople.Where(csp => csp.PersonId == personId).ToListAsync();
        _db.CourseSectionPeople.RemoveRange(courseSectionPeople);

        _db.People.Remove(person);
        await _db.SaveChangesAsync();
        return true;
    }
}
