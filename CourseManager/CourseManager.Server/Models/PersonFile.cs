namespace CourseManager.Server.Models;

public class PersonFile
{
    public int PersonId { get; set; }
    public Person Person { get; set; } = null!;

    public int FileAssetId { get; set; }
    public FileAsset FileAsset { get; set; } = null!;
}
