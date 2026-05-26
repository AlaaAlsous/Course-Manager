namespace CourseManager.Server.FileService
{
    public class LocalFileService : IFileService
    {
        public LocalFileService(DirectoryInfo baseDirectory)
        {
            BaseDirectory = baseDirectory;
        }
        public DirectoryInfo BaseDirectory { get; set; }
        public async Task<string?> CreateFileAsync(string filePath, byte[]? fileData)
        {
            string fullPath = Path.Combine(BaseDirectory.FullName, filePath);

            if (File.Exists(fullPath))  return null;

            using var newFile = File.Create(fullPath);

            if (fileData != null)
            {
                await newFile.WriteAsync(fileData);
            }
            return fullPath;
        }
        public async Task<byte[]> GetFileAsync(string filePath)
        {
            string fullPath = Path.Combine(BaseDirectory.FullName, filePath);
            byte[] data = File.ReadAllBytes(fullPath);
            return data;
        }
        public async Task<string> SaveFileAsync(string filePath, byte[] fileData)
        {
            string fullPath = Path.Combine(BaseDirectory.FullName, filePath);
            await File.WriteAllBytesAsync(fullPath, fileData);
            return fullPath;
        }
        public Task DeleteFileAsync(string filePath)
        {
            string fullPath = Path.Combine(BaseDirectory.FullName, filePath);
            File.Delete(fullPath);
            return Task.CompletedTask;
        }
    }
}
