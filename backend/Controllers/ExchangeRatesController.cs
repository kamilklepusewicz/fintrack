using backend.Services;
using Microsoft.AspNetCore.Mvc;
using System.Net.Http.Json;

namespace backend.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ExchangeRatesController : ControllerBase
{
    private readonly NbpService _nbpService;

    public ExchangeRatesController(NbpService nbpService)
    {
        _nbpService = nbpService;
    }

    [HttpGet]
    public async Task<IActionResult> GetRates()
    {
        var rates = await _nbpService.GetCurrentRatesAsync();
        return Ok(rates);
    }

    [HttpGet("history/{currency}")]
    public async Task<IActionResult> GetHistory(string currency)
    {
        using var client = new HttpClient();
        try 
        {
            var response = await client.GetFromJsonAsync<object>($"https://api.nbp.pl/api/exchangerates/rates/A/{currency}/last/30/?format=json");
            return Ok(response);
        }
        catch (Exception ex)
        {
            return BadRequest($"Nie udało się pobrać historii: {ex.Message}");
        }
    }
}