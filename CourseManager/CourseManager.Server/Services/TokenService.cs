using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Microsoft.IdentityModel.Tokens;
using CourseManager.Server.Models;

namespace CourseManager.Server.Services;

public class TokenService
{
    private readonly IConfiguration _config;

    public TokenService(IConfiguration config)
    {
        _config = config;
    }

    public string CreateToken(AppUser user)
    {
        var jwtKey = _config["Jwt:Key"]
            ?? "CourseManager_SuperSecretKey_2024_Min32Chars!";
        var issuer = _config["Jwt:Issuer"] ?? "CourseManager";
        var audience = _config["Jwt:Audience"] ?? "CourseManager";

        var securityKey = new SymmetricSecurityKey(
            Encoding.UTF8.GetBytes(jwtKey)
        );
        var credentials = new SigningCredentials(
            securityKey,
            SecurityAlgorithms.HmacSha256
        );

        var claims = new[]
        {
            new Claim(JwtRegisteredClaimNames.Sub, user.UserId.ToString()),
            new Claim(JwtRegisteredClaimNames.UniqueName, user.Username),
            new Claim(JwtRegisteredClaimNames.Name, user.DisplayName),
            new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()),
        };

        var token = new JwtSecurityToken(
            issuer: issuer,
            audience: audience,
            claims: claims,
            expires: DateTime.UtcNow.AddDays(7),
            signingCredentials: credentials
        );

        return new JwtSecurityTokenHandler().WriteToken(token);
    }
}