using System.Security.Claims;
using backend.Data;
using backend.Models;
using backend.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace backend.Controllers;

[Authorize]
[ApiController]
[Route("api/[controller]")]
public class TransactionsController : ControllerBase
{
    private readonly AppDbContext _context;
    private readonly NbpService _nbpService;

    public TransactionsController(AppDbContext context, NbpService nbpService)
    {
        _context = context;
        _nbpService = nbpService;
    }

    private int GetUserId() => int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? "0");

    [HttpGet]
    public async Task<IActionResult> GetTransactions()
    {
        int userId = GetUserId();
        var transactions = await _context.Transactions
            .Include(t => t.Category)
            .Include(t => t.Account)
            .Where(t => t.UserId == userId)
            .OrderByDescending(t => t.Date)
            .ToListAsync();
            
        return Ok(transactions);
    }

    [HttpPost]
    public async Task<IActionResult> AddTransaction(Transaction transaction)
    {
        int userId = GetUserId();
        transaction.UserId = userId;

        var account = await _context.Accounts.FirstOrDefaultAsync(a => a.Id == transaction.AccountId && a.UserId == userId);
        if (account == null)
        {
            return BadRequest("Wskazane konto nie istnieje lub nie należy do Ciebie.");
        }

        if (string.IsNullOrEmpty(transaction.CurrencyCode)) 
        {
            transaction.CurrencyCode = "PLN";
        }

        transaction.ExchangeRate = await _nbpService.GetRateForDateAsync(transaction.CurrencyCode, transaction.Date);
        transaction.AmountInPln = transaction.Amount * transaction.ExchangeRate;
        transaction.CreatedAt = DateTime.UtcNow;

        decimal changeAmount = (account.CurrencyCode == transaction.CurrencyCode) ? transaction.Amount : transaction.AmountInPln;

        if (transaction.Type == "Przychód")
        {
            account.CurrentBalance += changeAmount;
        }
        else
        {
            account.CurrentBalance -= changeAmount;
        }

        _context.Transactions.Add(transaction);
        await _context.SaveChangesAsync();

        return Ok(transaction);
    }
}