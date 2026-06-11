using System.Security.Claims;
using backend.Data;
using backend.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace backend.Controllers;

[Authorize]
[ApiController]
[Route("api/[controller]")]
public class AccountsController : ControllerBase
{
    private readonly AppDbContext _context;

    public AccountsController(AppDbContext context)
    {
        _context = context;
    }

    private int GetUserId() => int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? "0");

    [HttpGet]
    public async Task<IActionResult> GetAccounts()
    {
        int userId = GetUserId();
        var accounts = await _context.Accounts.Where(a => a.UserId == userId).ToListAsync();
        return Ok(accounts);
    }

    [HttpPost]
    public async Task<IActionResult> AddAccount(Account account)
    {
        account.UserId = GetUserId(); 
        account.CurrentBalance = account.InitialBalance;
        account.CreatedAt = DateTime.UtcNow;

        _context.Accounts.Add(account);
        await _context.SaveChangesAsync();
        return Ok(account);
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteAccount(int id)
    {
        int userId = GetUserId();
        var account = await _context.Accounts.FirstOrDefaultAsync(a => a.Id == id && a.UserId == userId);
        if (account == null) return NotFound("Konto nie istnieje.");

        var relatedTransactions = _context.Transactions.Where(t => t.AccountId == id);
        _context.Transactions.RemoveRange(relatedTransactions);

        _context.Accounts.Remove(account);
        await _context.SaveChangesAsync();
        return Ok();
    }
}