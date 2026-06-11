namespace backend.Models;

public class ExchangeRate
{
    public int Id { get; set; }
    public string CurrencyCode { get; set; } = string.Empty;
    public decimal Rate { get; set; }
    public DateTime Date { get; set; }
    public string Source { get; set; } = "NBP";
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}