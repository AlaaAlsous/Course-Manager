using CourseManager.Server.Data;
using CourseManager.Server.DTOs;
using CourseManager.Server.Models;
using CourseManager.Server.Services;
using Microsoft.EntityFrameworkCore;

public static class AuthEndpoints
{
    public static IEndpointRouteBuilder MapAuthEndpoints(this IEndpointRouteBuilder routes)
    {
        var group = routes.MapGroup("/api/auth");

        group.MapPost("/register", async (
            RegisterRequest req,
            AppDbContext db,
            TokenService tokenService
        ) =>
        {
            var username = req.Username.Trim().ToLowerInvariant();

            var existing = await db.AppUsers
                .FirstOrDefaultAsync(u => u.Username == username);

            if (existing is not null)
            {
                return Results.Conflict(new { message = "Username already exists." });
            }

            var user = new AppUser
            {
                Username = username,
                PasswordHash = BCrypt.Net.BCrypt.HashPassword(req.Password),
                DisplayName = req.DisplayName.Trim(),
                CreatedAt = DateTime.UtcNow
            };

            db.AppUsers.Add(user);
            await db.SaveChangesAsync();

            var token = tokenService.CreateToken(user);

            return Results.Created($"/api/auth/{user.UserId}",
                new AuthResponse(token, user.UserId, user.Username, user.DisplayName));
        });

        group.MapPost("/login", async (
            LoginRequest req,
            AppDbContext db,
            TokenService tokenService
        ) =>
        {
            var username = req.Username.Trim().ToLowerInvariant();

            var user = await db.AppUsers
                .FirstOrDefaultAsync(u => u.Username == username);

            if (user is null || !BCrypt.Net.BCrypt.Verify(req.Password, user.PasswordHash))
            {
                return Results.Json(
                    new { message = "Invalid username or password." },
                    statusCode: StatusCodes.Status401Unauthorized
                );
            }

            var token = tokenService.CreateToken(user);

            return Results.Ok(new AuthResponse(token, user.UserId, user.Username, user.DisplayName));
        });

        return routes;
    }

    public static async Task SeedDefaultUserAsync(AppDbContext db)
    {
        if (await db.AppUsers.AnyAsync())
            return;

        var admin = new AppUser
        {
            Username = "admin",
            PasswordHash = BCrypt.Net.BCrypt.HashPassword("admin123"),
            DisplayName = "Administrator",
            CreatedAt = DateTime.UtcNow
        };

        db.AppUsers.Add(admin);
        await db.SaveChangesAsync();
    }
}