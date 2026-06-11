using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using backend.Data;
using backend.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;

namespace backend.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    private readonly AppDbContext _context;
    private const string JwtSecret = "SuperTajnyKluczDoSzyfrowaniaTokenowFinTrack2026!!!";

    public AuthController(AppDbContext context)
    {
        _context = context;
    }

    [HttpPost("register")]
    public async Task<IActionResult> Register(UserDto model)
    {
        if (await _context.Users.AnyAsync(u => u.Email == model.Email))
            return BadRequest("Użytkownik o takim adresie e-mail już istnieje.");

        var user = new User
         {
            Email = model.Email,
            PasswordHash = model.Password
        };

        _context.Users.Add(user);
        await _context.SaveChangesAsync();

        _context.Accounts.Add(new Account 
        { 
            UserId = user.Id, 
            Name = "Portfel Główny", 
            CurrencyCode = "PLN", 
            Type = "Gotówka" 
        });
        await _context.SaveChangesAsync();

        return Ok(new { message = "Rejestracja pomyślna" });
    }

    [HttpPost("login")]
    public async Task<IActionResult> Login(UserDto model)
    {
        var user = await _context.Users.FirstOrDefaultAsync(u => u.Email == model.Email && u.PasswordHash == model.Password);
        if (user == null)
            return Unauthorized("Nieprawidłowy e-mail lub hasło.");

        // Generowanie tokena JWT ważnego przez 7 dni
        var tokenHandler = new JwtSecurityTokenHandler();
        var key = Encoding.ASCII.GetBytes(JwtSecret);
        var tokenDescriptor = new SecurityTokenDescriptor
        {
            Subject = new ClaimsIdentity(new[] { 
                new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
                new Claim(ClaimTypes.Email, user.Email)
            }),
            Expires = DateTime.UtcNow.AddDays(7),
            SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256Signature)
        };
        var token = tokenHandler.CreateToken(tokenDescriptor);
        var tokenString = tokenHandler.WriteToken(token);

        return Ok(new { Token = tokenString, Email = user.Email });
    }
}

public class UserDto
{
    public string Email { get; set; } = string.Empty;
    public string Password { get; set; } = string.Empty;
}