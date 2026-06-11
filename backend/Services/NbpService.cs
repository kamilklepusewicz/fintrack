using System.Net.Http.Json;
using backend.Data;
using backend.Models;
using Microsoft.EntityFrameworkCore;

namespace backend.Services;

public class NbpService
{
    private readonly HttpClient _httpClient;
    private readonly AppDbContext _context;
    private readonly string[] _allowedCurrencies = { "EUR", "USD", "CHF", "GBP" };

    public NbpService(HttpClient httpClient, AppDbContext context)
    {
        _httpClient = httpClient;
        _context = context;
    }

    public async Task<List<ExchangeRate>> GetCurrentRatesAsync()
    {
        var today = DateTime.UtcNow.Date;
        
        var cachedRates = await _context.ExchangeRates
            .Where(r => r.Date == today)
            .ToListAsync();

        if (cachedRates.Count >= _allowedCurrencies.Length)
        {
            return cachedRates;
        }

        try
        {
            var response = await _httpClient.GetFromJsonAsync<NbpTableA[]>("exchangerates/tables/A/?format=json");
            if (response != null && response.Length > 0)
            {
                var nbpRates = response[0].Rates;
                var effectiveDate = DateTime.Parse(response[0].EffectiveDate);

                var newRates = new List<ExchangeRate>();

                foreach (var rateData in nbpRates)
                {
                    if (_allowedCurrencies.Contains(rateData.Code))
                    {
                        var exists = await _context.ExchangeRates
                            .AnyAsync(r => r.CurrencyCode == rateData.Code && r.Date == effectiveDate);

                        if (!exists)
                        {
                            var rate = new ExchangeRate
                            {
                                CurrencyCode = rateData.Code,
                                Rate = rateData.Mid,
                                Date = effectiveDate,
                                Source = "NBP"
                            };
                            newRates.Add(rate);
                        }
                    }
                }

                if (newRates.Any())
                {
                    _context.ExchangeRates.AddRange(newRates);
                    await _context.SaveChangesAsync();
                }
            }
        }
        catch (Exception ex)
        {
            Console.WriteLine($"Błąd pobierania kursów NBP: {ex.Message}");
        }

        return await _context.ExchangeRates.Where(r => r.Date == today).ToListAsync();
    }

    public async Task<decimal> GetRateForDateAsync(string currencyCode, DateTime date)
    {
        if (currencyCode == "PLN") return 1.0m;

        var dateOnly = date.Date;
        var rate = await _context.ExchangeRates
            .Where(r => r.CurrencyCode == currencyCode && r.Date <= dateOnly)
            .OrderByDescending(r => r.Date)
            .FirstOrDefaultAsync();

        if (rate != null) return rate.Rate;

        try
        {
            var dateStr = dateOnly.ToString("yyyy-MM-dd");
            var url = $"exchangerates/rates/A/{currencyCode}/{dateStr}/?format=json";
            var response = await _httpClient.GetFromJsonAsync<NbpCurrencyResponse>(url);
            
            if (response != null && response.Rates.Count > 0)
            {
                var newRate = new ExchangeRate
                {
                    CurrencyCode = currencyCode,
                    Rate = response.Rates[0].Mid,
                    Date = dateOnly,
                    Source = "NBP"
                };
                _context.ExchangeRates.Add(newRate);
                await _context.SaveChangesAsync();
                return newRate.Rate;
            }
        }
        catch
        {
            var latestRate = await _context.ExchangeRates
                .Where(r => r.CurrencyCode == currencyCode)
                .OrderByDescending(r => r.Date)
                .FirstOrDefaultAsync();

            if (latestRate != null) return latestRate.Rate;
        }

        return 1.0m;
    }
}

public class NbpTableA
{
    public string EffectiveDate { get; set; } = string.Empty;
    public List<NbpRate> Rates { get; set; } = new();
}

public class NbpRate
{
    public string Code { get; set; } = string.Empty;
    public decimal Mid { get; set; }
}

public class NbpCurrencyResponse
{
    public List<NbpRate> Rates { get; set; } = new();
}