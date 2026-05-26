namespace CourseManager.Server.Models;

public class CourseEventFile
{
    public int CourseEventId { get; set; }
    public CourseEvent CourseEvent { get; set; } = null!;

    public int FileAssetId { get; set; }
    public FileAsset FileAsset { get; set; } = null!;
}
