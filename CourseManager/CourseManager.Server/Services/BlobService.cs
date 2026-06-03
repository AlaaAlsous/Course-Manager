using Azure.Storage.Blobs;
using Azure.Storage.Blobs.Models;

public class BlobService
{
    private readonly BlobContainerClient _container;

    public BlobService(IConfiguration config)
    {
        var conn = config["AzureStorage:ConnectionString"];
        var containerName = config["AzureStorage:ContainerName"];

        _container = new BlobContainerClient(conn, containerName);
        _container.CreateIfNotExists(PublicAccessType.Blob);
    }

    public async Task<string> UploadAsync(string fileName, Stream stream)
    {
        var blob = _container.GetBlobClient(fileName);
        await blob.UploadAsync(stream, overwrite: true);
        return blob.Uri.ToString();
    }

    public async Task<bool> DeleteAsync(string fileName)
    {
        var blob = _container.GetBlobClient(fileName);
        return await blob.DeleteIfExistsAsync();
    }

    public async Task<Stream> DownloadAsync(string fileName)
    {
        var blob = _container.GetBlobClient(fileName);
        var download = await blob.DownloadAsync();
        return download.Value.Content;
    }
}
