namespace backend.Models;

public class Transaction
{
    public int Id { get; set; }
    public int UserId { get; set; }
    public User? User { get; set; }
    public int AccountId { get; set; }
    public Account? Account { get; set; }
    public int CategoryId { get; set; }
    public Category? Category { get; set; }
    public string Type { get; set; } = string.Empty;
    public decimal Amount { get; set; }
    public string CurrencyCode { get; set; } = "PLN";
    public decimal ExchangeRate { get; set; } = 1.0m;
    public decimal AmountInPln { get; set; }
    public DateTime Date { get; set; }
    public string Description { get; set; } = string.Empty;
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}