using NUnit.Framework;
using Microsoft.EntityFrameworkCore;
using backend.Data;
using backend.Models;
using System;
using System.Linq;
using System.Threading.Tasks;

namespace backend.Tests;

[TestFixture]
public class DatabaseAndLogicTests
{
    private AppDbContext _context;

    [SetUp]
    public void Setup()
    {
        var options = new DbContextOptionsBuilder<AppDbContext>()
            .UseInMemoryDatabase(databaseName: Guid.NewGuid().ToString())
            .Options;
            
        _context = new AppDbContext(options);
        _context.Database.EnsureCreated();
    }

    [TearDown]
    public void TearDown()
    {
        _context.Database.EnsureDeleted();
        _context.Dispose();
    }

    [Test]
    public async Task CreateAccount_ShouldSaveToDatabase_WithCorrectInitialBalance()
    {
        var newAccount = new Account 
        { 
            UserId = 1, 
            Name = "Konto Testowe Docker", 
            CurrencyCode = "EUR", 
            InitialBalance = 150.50m, 
            CurrentBalance = 150.50m,
            Type = "Konto bankowe",
            CreatedAt = DateTime.UtcNow
        };

        _context.Accounts.Add(newAccount);
        await _context.SaveChangesAsync();

        var savedAccount = await _context.Accounts.FirstOrDefaultAsync(a => a.Name == "Konto Testowe Docker");
        Assert.That(savedAccount, Is.Not.Null);
        Assert.That(savedAccount.Id, Is.GreaterThan(0), "ID powinno zostać wygenerowane automatycznie.");
        Assert.That(savedAccount.CurrentBalance, Is.EqualTo(150.50m));
    }

    [Test]
    public async Task ProcessTransaction_Expense_ShouldDecreaseAccountBalance()
    {
        var account = new Account { UserId = 1, Name = "Portfel", CurrencyCode = "PLN", CurrentBalance = 1000m };
        _context.Accounts.Add(account);
        await _context.SaveChangesAsync();

        var transaction = new Transaction 
        { 
            AccountId = account.Id, 
            UserId = 1, 
            Amount = 200m, 
            Type = "Wydatek", 
            CurrencyCode = "PLN", 
            AmountInPln = 200m 
        };
        
        var dbAccount = await _context.Accounts.FindAsync(transaction.AccountId);
        if (dbAccount != null && transaction.Type == "Wydatek") 
        {
            dbAccount.CurrentBalance -= transaction.AmountInPln;
        }

        _context.Transactions.Add(transaction);
        await _context.SaveChangesAsync();

        var updatedAccount = await _context.Accounts.FindAsync(account.Id);
        Assert.That(updatedAccount.CurrentBalance, Is.EqualTo(800m), "Saldo powinno zmaleć po wydatku.");
        Assert.That(_context.Transactions.Count(), Is.EqualTo(1), "Transakcja powinna być zapisana w bazie.");
    }

    [Test]
    public async Task ProcessTransaction_IncomeInForeignCurrency_ShouldIncreaseBalanceCorrectly()
    {
        var account = new Account { UserId = 2, Name = "Konto Walutowe", CurrencyCode = "EUR", CurrentBalance = 100m };
        _context.Accounts.Add(account);
        await _context.SaveChangesAsync();

        var transaction = new Transaction 
        { 
            AccountId = account.Id, 
            UserId = 2, 
            Amount = 50m, 
            Type = "Przychód", 
            CurrencyCode = "EUR", 
            AmountInPln = 215m 
        };

        var dbAccount = await _context.Accounts.FindAsync(transaction.AccountId);
        if (dbAccount != null && transaction.Type == "Przychód") 
        {
            dbAccount.CurrentBalance += transaction.Amount; 
        }

        await _context.SaveChangesAsync();

        var updatedAccount = await _context.Accounts.FindAsync(account.Id);
        Assert.That(updatedAccount.CurrentBalance, Is.EqualTo(150m), "Saldo walutowe powinno wzrosnąć o kwotę w walucie konta, a nie w PLN.");
    }

    [Test]
    public async Task Categories_SystemCategories_ShouldNotHaveUserId()
    {
        var systemCategory = new Category { Name = "Jedzenie", Type = "Wydatek", UserId = null };
        var userCategory = new Category { Name = "Prezenty", Type = "Wydatek", UserId = 5 };

        _context.Categories.AddRange(systemCategory, userCategory);
        await _context.SaveChangesAsync();

        var savedSystem = await _context.Categories.FirstOrDefaultAsync(c => c.Name == "Jedzenie");
        var savedUser = await _context.Categories.FirstOrDefaultAsync(c => c.Name == "Prezenty");

        Assert.That(savedSystem.UserId, Is.Null, "Kategoria systemowa musi mieć UserId równe null, by była widoczna dla wszystkich.");
        Assert.That(savedUser.UserId, Is.EqualTo(5), "Kategoria użytkownika musi być przypisana do jego ID.");
    }
}