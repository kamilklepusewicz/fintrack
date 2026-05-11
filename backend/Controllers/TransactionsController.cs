using backend.Data;
using backend.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace backend.Controllers;

[ApiController]
[Route("api/[controller]")]
public class TransactionsController : ControllerBase
{
    private readonly AppDbContext _context;

    public TransactionsController(AppDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<IActionResult> GetTransactions()
    {
        var transactions = await _context.Transactions
            .Include(t => t.Category)
            .ToListAsync();

        return Ok(transactions);
    }

    [HttpPost]
    public async Task<IActionResult> AddTransaction([FromBody] Transaction transaction)
    {
        _context.Transactions.Add(transaction);
        
        await _context.SaveChangesAsync();

        return CreatedAtAction(nameof(GetTransactions), new { id = transaction.Id }, transaction);
    }
}