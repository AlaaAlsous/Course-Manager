using Azure.Storage.Blobs;
using Azure.Storage.Blobs.Models;

public class BlobService
{
    private readonly BlobContainerClient? _container;
    private bool _initialized;
    private bool _initializationFailed;
    private readonly SemaphoreSlim _initLock = new(1, 1);

    public BlobService(IConfiguration config)
    {
        var conn = config["AzureStorage:ConnectionString"];
        var containerName = config["AzureStorage:ContainerName"];

        if (!string.IsNullOrWhiteSpace(conn) && !string.IsNullOrWhiteSpace(containerName))
        {
            _container = new BlobContainerClient(conn, containerName);
        }
    }

    private async Task EnsureInitializedAsync()
    {
        if (_initialized || _initializationFailed || _container is null)
            return;

        await _initLock.WaitAsync();
        try
        {
            if (_initialized || _initializationFailed)
                return;

            try
            {
                await _container.CreateIfNotExistsAsync(PublicAccessType.Blob);
                _initialized = true;
            }
            catch (Exception ex)
            {
                _initializationFailed = true;
                Console.Error.WriteLine($"Failed to initialize Azure Blob container: {ex.Message}");
                throw;
            }
        }
        finally
        {
            _initLock.Release();
        }
    }

    public async Task<string> UploadAsync(string fileName, Stream stream)
    {
        await EnsureInitializedAsync();
        if (_container is null)
            throw new InvalidOperationException("Azure Blob Storage is not configured.");

        var blob = _container.GetBlobClient(fileName);
        await blob.UploadAsync(stream, overwrite: true);
        return blob.Uri.ToString();
    }

    public async Task<bool> DeleteAsync(string fileName)
    {
        await EnsureInitializedAsync();
        if (_container is null)
            throw new InvalidOperationException("Azure Blob Storage is not configured.");

        var blob = _container.GetBlobClient(fileName);
        return await blob.DeleteIfExistsAsync();
    }

    public async Task<Stream> DownloadAsync(string fileName)
    {
        await EnsureInitializedAsync();
        if (_container is null)
            throw new InvalidOperationException("Azure Blob Storage is not configured.");

        var blob = _container.GetBlobClient(fileName);
        var download = await blob.DownloadAsync();
        return download.Value.Content;
    }
}