namespace CourseManager.Server.Models;

public class CourseEventPerson
{
    public int CourseEventId { get; set; }
    public CourseEvent CourseEvent { get; set; } = null!;

    public int PersonId { get; set; }
    public Person Person { get; set; } = null!;
}
