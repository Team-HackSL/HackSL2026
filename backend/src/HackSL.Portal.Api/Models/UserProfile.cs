namespace HackSL.Portal.Api.Models;

public class UserProfile
{
    public Guid Id { get; set; } = Guid.NewGuid();

    public Guid UserId { get; set; }
    public User? User { get; set; }

    // Personal details
    public string FullName { get; set; } = string.Empty;
    public DateOnly DateOfBirth { get; set; }
    public string Institution { get; set; } = string.Empty;

    /// <summary>Optional self-introduction / past hackathon achievements, used for team matching.</summary>
    public string? Description { get; set; }

    // Programming languages, stored as a PostgreSQL text[] column.
    public List<string> ProgrammingLanguages { get; set; } = new();

    // Social / professional links
    public string? LinkedInUrl { get; set; }
    public string? GitHubUrl { get; set; }

    // Uploaded assets (URLs to the stored files)
    public string? ResumeUrl { get; set; }
    public string? ResumeFileName { get; set; }
    public string? ProfilePhotoUrl { get; set; }

    // Consent & opt-in toggles
    public bool ConsentToShareData { get; set; }
    public bool MatchWithTeam { get; set; }
    public bool InterestedInFellowship { get; set; }

    /// <summary>Opt-in: weekly newsletter (upcoming hackathons, that week's blogs, last week's winners).</summary>
    public bool SubscribeToNewsletter { get; set; }

    // Skill sliders (e.g. "Frontend Development" -> 80)
    public List<SkillRating> Skills { get; set; } = new();

    public DateTimeOffset CreatedAt { get; set; } = DateTimeOffset.UtcNow;
    public DateTimeOffset UpdatedAt { get; set; } = DateTimeOffset.UtcNow;
}
