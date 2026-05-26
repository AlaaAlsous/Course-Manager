using CourseManager.Server.FileService;
using Microsoft.AspNetCore.Mvc.Infrastructure;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddScoped<IFileService>(sp =>
{
    var env = sp.GetRequiredService<IWebHostEnvironment>();
    var basePath = Path.Combine(env.ContentRootPath, "Data", "Storage");
    var directory = Directory.CreateDirectory(basePath);

    return new LocalFileService(directory);
});

var app = builder.Build();

app.MapGet("/", () => "Hello World!");

app.Run();
