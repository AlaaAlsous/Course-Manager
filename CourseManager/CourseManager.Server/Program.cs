using CourseManager.Server.Data;
using CourseManager.Server.Repositories;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddDbContext<AppDbContext>(options =>
{
    var azureConn = builder.Configuration.GetConnectionString("AzureSqlConnection");

    if (!string.IsNullOrWhiteSpace(azureConn))
    {
        Console.WriteLine("Using Azure SQL Database");

        options.UseSqlServer(azureConn, sqlOptions =>
        {
            sqlOptions.EnableRetryOnFailure(
                maxRetryCount: 5,
                maxRetryDelay: TimeSpan.FromSeconds(10),
                errorNumbersToAdd: null
            );
        });
    }
    else
    {
        Console.WriteLine("Using Local SQL Server (LocalDB)");

        var localConn = "Server=(localdb)\\MSSQLLocalDB;Database=CourseManagerDb;Trusted_Connection=True;";
        options.UseSqlServer(localConn);
    }
});

builder.Services.AddCors(options =>
{
    options.AddPolicy("Default", policy =>
    {
        policy
            .WithOrigins(
                "https://coursemanager-app-gvdhhqf5fve7awff.germanywestcentral-01.azurewebsites.net",
                "http://localhost:4200",
                "https://localhost:4200"
            )
            .SetIsOriginAllowedToAllowWildcardSubdomains()
            .AllowAnyHeader()
            .AllowAnyMethod()
            .WithExposedHeaders("Content-Disposition");
    });
});

builder.Services.AddScoped<ICourseRepository, CourseRepository>();
builder.Services.AddScoped<ICourseSectionRepository, CourseSectionRepository>();
builder.Services.AddScoped<IPersonRepository, PersonRepository>();
builder.Services.AddScoped<IGroupRepository, GroupRepository>();
builder.Services.AddScoped<IFileRepository, FileRepository>();
builder.Services.AddScoped<BlobService>();

var app = builder.Build();

using (var scope = app.Services.CreateScope())
{
    var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
    db.Database.Migrate();
}

app.UseDefaultFiles();
app.UseStaticFiles();

app.UseHttpsRedirection();

app.UseCors("Default");

app.MapCourseEndpoints();
app.MapCourseSectionEndpoints();
app.MapPersonEndpoints();
app.MapGroupEndpoints();
app.MapRelationsEndpoints();
app.MapFileEndpoints();
app.MapFallbackToFile("index.html");

app.Run();
