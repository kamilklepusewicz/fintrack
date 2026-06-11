namespace backend.Models;

public class Account
{
    public int Id { get; set; }
    public int UserId { get; set; }
    public User? User { get; set; }
    public string Name { get; set; } = string.Empty;
    public string CurrencyCode { get; set; } = "PLN";
    public decimal InitialBalance { get; set; }
    public decimal CurrentBalance { get; set; }
    public string Type { get; set; } = string.Empty;
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}