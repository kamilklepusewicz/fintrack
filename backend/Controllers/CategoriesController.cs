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
public class CategoriesController : ControllerBase
{
    private readonly AppDbContext _context;

    public CategoriesController(AppDbContext context)
    {
        _context = context;
    }

    private int GetUserId() => int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? "0");

    [HttpGet]
    public async Task<IActionResult> GetCategories()
    {
        int userId = GetUserId();
        var categories = await _context.Categories
            .Where(c => c.UserId == null || c.UserId == userId)
            .ToListAsync();
        return Ok(categories);
    }

    [HttpPost]
    public async Task<IActionResult> AddCategory(Category category)
    {
        category.UserId = GetUserId();
        _context.Categories.Add(category);
        await _context.SaveChangesAsync();
        return Ok(category);
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteCategory(int id)
    {
        int userId = GetUserId();
        var category = await _context.Categories.FirstOrDefaultAsync(c => c.Id == id && c.UserId == userId);
        
        if (category == null) 
            return BadRequest("Nie możesz usunąć tej kategorii (jest systemowa lub nie należy do Ciebie).");

        _context.Categories.Remove(category);
        await _context.SaveChangesAsync();
        return Ok();
    }
}