namespace CourseManager.Server.Models;

public class CourseSectionFile
{
    public int CourseSectionId { get; set; }
    public CourseSection CourseSection { get; set; } = null!;

    public int FileAssetId { get; set; }
    public FileAsset FileAsset { get; set; } = null!;
}
