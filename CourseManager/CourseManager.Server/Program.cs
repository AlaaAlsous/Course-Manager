using CourseManager.Server.Data;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseSqlite("Data Source=data/course-manager.db"));

builder.Services.AddCors(options =>
{
    options.AddPolicy("Default", policy =>
    {
        policy
            .AllowAnyHeader()
            .AllowAnyMethod()
            .AllowCredentials()
            .WithOrigins(
                "http://localhost:4200",
                "https://localhost:4200"
            );
    });
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

using (var scope = app.Services.CreateScope())
{
    var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
    db.Database.Migrate();
}

app.UseCors("Default");

app.MapGet("/", () => "CourseManager API is running");

// Minimal API endpoints kommer här
// app.MapCourseEndpoints();
// app.MapCourseEventEndpoints();
// app.MapGroupEndpoints();
// app.MapPersonEndpoints();
// app.MapFileEndpoints();

app.Run();