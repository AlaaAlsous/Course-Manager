namespace CourseManager.Server.Models;
public class GroupPerson
{
    public int GroupId { get; set; }
    public Group Group { get; set; } = null!;

    public int PersonId { get; set; }
    public Person Person { get; set; } = null!;
}
