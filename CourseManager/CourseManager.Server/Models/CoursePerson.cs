namespace CourseManager.Server.Models;
public class CoursePerson
{
    public int CourseId { get; set; }
    public Course Course { get; set; } = null!;

    public int PersonId { get; set; }
    public Person Person { get; set; } = null!;
}
