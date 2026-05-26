namespace CourseManager.Server.Models;
public class CourseFile
{
    public int CourseId { get; set; }
    public Course Course { get; set; } = null!;

    public int FileAssetId { get; set; }
    public FileAsset FileAsset { get; set; } = null!;
}
