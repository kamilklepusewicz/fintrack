using System.Text;
using backend.Data;
using backend.Services;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;

var builder = WebApplication.CreateBuilder(args);

Directory.CreateDirectory("db");

builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseSqlite("Data Source=db/fintrack.db"));

builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseSqlite("Data Source=fintrack.db"));

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowReact", policy =>
    {
        policy.WithOrigins("http://localhost:5173")
              .AllowAnyMethod()
              .AllowAnyHeader();
    });
});

builder.Services.AddHttpClient<NbpService>(client =>
{
    client.BaseAddress = new Uri("https://api.nbp.pl/api/");
});

var jwtSecret = "SuperTajnyKluczDoSzyfrowaniaTokenowFinTrack2026!!!";
var key = Encoding.ASCII.GetBytes(jwtSecret);

builder.Services.AddAuthentication(x =>
{
    x.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    x.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
})
.AddJwtBearer(x =>
{
    x.RequireHttpsMetadata = false;
    x.SaveToken = true;
    x.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuerSigningKey = true,
        IssuerSigningKey = new SymmetricSecurityKey(key),
        ValidateIssuer = false,
        ValidateAudience = false
    };
});

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

builder.Services.AddControllers();

var app = builder.Build();

using (var scope = app.Services.CreateScope())
{
    var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
    db.Database.EnsureCreated();

    if (!db.Users.Any())
    {
        db.Users.Add(new backend.Models.User { Email = "test@test.pl", PasswordHash = "dummyhash" });
        db.SaveChanges();
    }

    if (!db.Accounts.Any())
    {
        var user = db.Users.First();
        db.Accounts.Add(new backend.Models.Account 
        { 
            UserId = user.Id, 
            Name = "Portfel Główny", 
            CurrencyCode = "PLN", 
            InitialBalance = 0, 
            CurrentBalance = 0, 
            Type = "Gotówka" 
        });
        db.SaveChanges();
    }

    if (!db.Categories.Any(c => c.Name == "Jedzenie"))
    {
        db.Categories.AddRange(
            new backend.Models.Category { Name = "Jedzenie", Type = "Wydatek" },
            new backend.Models.Category { Name = "Transport", Type = "Wydatek" },
            new backend.Models.Category { Name = "Rozrywka", Type = "Wydatek" },
            new backend.Models.Category { Name = "Wynagrodzenie", Type = "Przychód" }
        );
        db.SaveChanges();
    }
}

app.UseCors("AllowReact");

if (app.Environment.IsDevelopment() || true)
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

app.Run();