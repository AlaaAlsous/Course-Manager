namespace CourseManager.Server.Models;
public class GroupFile
{
    public int GroupId { get; set; }
    public Group Group { get; set; } = null!;

    public int FileAssetId { get; set; }
    public FileAsset FileAsset { get; set; } = null!;
}
