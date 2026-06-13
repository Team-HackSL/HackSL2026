namespace HackSL.Portal.Api.Models;

/// <summary>
/// A single skill slider, e.g. Category = "Backend Development", Level = 70 (0-100).
/// </summary>
public class SkillRating
{
    public Guid Id { get; set; } = Guid.NewGuid();

    public Guid ProfileId { get; set; }
    public UserProfile? Profile { get; set; }

    public string Category { get; set; } = string.Empty;

    /// <summary>Proficiency on a 0-100 scale.</summary>
    public int Level { get; set; }
}
