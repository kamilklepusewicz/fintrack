namespace backend.Models;

public class Category
{
    public int Id { get; set; }
    public int? UserId { get; set; }
    public User? User { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Type { get; set; } = string.Empty;
}