using System.Text;
using CourseManager.Server.Data;
using CourseManager.Server.Repositories;
using CourseManager.Server.Services;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;

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
builder.Services.AddScoped<TokenService>();

var jwtKey = builder.Configuration["Jwt:Key"]
    ?? "CourseManager_SuperSecretKey_2024_Min32Chars!";
var jwtIssuer = builder.Configuration["Jwt:Issuer"] ?? "CourseManager";
var jwtAudience = builder.Configuration["Jwt:Audience"] ?? "CourseManager";

builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,
            ValidIssuer = jwtIssuer,
            ValidAudience = jwtAudience,
            IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtKey)),
            ClockSkew = TimeSpan.Zero
        };

        options.Events = new JwtBearerEvents
        {
            OnMessageReceived = context =>
            {
                var accessToken = context.Request.Query["access_token"];
                var path = context.HttpContext.Request.Path;

                if (!string.IsNullOrEmpty(accessToken) &&
                    path.StartsWithSegments("/api/files"))
                {
                    context.Token = accessToken;
                }

                return Task.CompletedTask;
            }
        };
    });

builder.Services.AddAuthorization();

var app = builder.Build();

using (var scope = app.Services.CreateScope())
{
    var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
    db.Database.Migrate();
    await AuthEndpoints.SeedDefaultUserAsync(db);
}

app.UseDefaultFiles();
app.UseStaticFiles();

app.UseHttpsRedirection();

app.UseCors("Default");

app.UseAuthentication();
app.UseAuthorization();

app.MapAuthEndpoints();
app.MapCourseEndpoints();
app.MapCourseSectionEndpoints();
app.MapPersonEndpoints();
app.MapGroupEndpoints();
app.MapRelationsEndpoints();
app.MapFileEndpoints();
app.MapFallbackToFile("index.html");

app.Run();
