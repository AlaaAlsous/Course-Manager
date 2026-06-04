using Azure.Storage.Blobs;
using Azure.Storage.Blobs.Models;

public class BlobService
{
    private readonly BlobContainerClient? _container;

    public BlobService(IConfiguration config)
    {
        var conn = config["AzureStorage:ConnectionString"];
        var containerName = config["AzureStorage:ContainerName"];

        if (!string.IsNullOrWhiteSpace(conn) && !string.IsNullOrWhiteSpace(containerName))
        {
            _container = new BlobContainerClient(conn, containerName);
            _container.CreateIfNotExists(PublicAccessType.Blob);
        }
    }

    public async Task<string> UploadAsync(string fileName, Stream stream)
    {
        if (_container is null)
            throw new InvalidOperationException("Azure Blob Storage is not configured.");

        var blob = _container.GetBlobClient(fileName);
        await blob.UploadAsync(stream, overwrite: true);
        return blob.Uri.ToString();
    }

    public async Task<bool> DeleteAsync(string fileName)
    {
        if (_container is null)
            throw new InvalidOperationException("Azure Blob Storage is not configured.");

        var blob = _container.GetBlobClient(fileName);
        return await blob.DeleteIfExistsAsync();
    }

    public async Task<Stream> DownloadAsync(string fileName)
    {
        if (_container is null)
            throw new InvalidOperationException("Azure Blob Storage is not configured.");

        var blob = _container.GetBlobClient(fileName);
        var download = await blob.DownloadAsync();
        return download.Value.Content;
    }
}
