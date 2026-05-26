namespace CourseManager.Server.Models;

public class CourseSectionPerson
{
    public int CourseSectionId { get; set; }
    public CourseSection CourseSection { get; set; } = null!;

    public int PersonId { get; set; }
    public Person Person { get; set; } = null!;
}
