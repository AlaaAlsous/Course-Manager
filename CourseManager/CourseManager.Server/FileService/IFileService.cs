namespace CourseManager.Server.FileService
{
    public interface IFileService
    {
        public Task<string?> CreateFileAsync(string filePath, byte[]? fileData);
        public Task<string> SaveFileAsync(string filePath, byte[] fileData);
        public Task DeleteFileAsync(string filePath);
        public Task<byte[]> GetFileAsync(string filePath);
    }
}
