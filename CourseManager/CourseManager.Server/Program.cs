using CourseManager.Server.Data;
using CourseManager.Server.Repositories;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddDbContext<AppDbContext>(options =>
{
    var azureConn = builder.Configuration.GetConnectionString("AzureSqlConnection");
    var localConn = "Data Source=data/course-manager.db";

    if (!string.IsNullOrWhiteSpace(azureConn))
    {
        Console.WriteLine("Using Azure SQL Database");
        options.UseSqlServer(azureConn);
    }
    else
    {
        Console.WriteLine("Using local SQLite Database");
        options.UseSqlite(localConn);
    }
});

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
});

builder.Services.AddScoped<ICourseRepository, CourseRepository>();
builder.Services.AddScoped<ICourseSectionRepository, CourseSectionRepository>();
builder.Services.AddScoped<IPersonRepository, PersonRepository>();
builder.Services.AddScoped<IGroupRepository, GroupRepository>();
builder.Services.AddScoped<IFileRepository, FileRepository>();

var app = builder.Build();

using (var scope = app.Services.CreateScope())
{
    var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
    db.Database.Migrate();
}

app.UseCors("Default");

app.MapCourseEndpoints();
app.MapCourseSectionEndpoints();
app.MapPersonEndpoints();
app.MapGroupEndpoints();
app.MapFileEndpoints();

app.MapGet("/", () => "CourseManager API is running");

app.Run();
