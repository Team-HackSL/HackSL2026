namespace HackSL.Portal.Api.Dtos;

public class ProfileResponse
{
    public Guid Id { get; set; }
    public string Email { get; set; } = string.Empty;
    public string FullName { get; set; } = string.Empty;
    public DateOnly DateOfBirth { get; set; }
    public string Institution { get; set; } = string.Empty;
    public string? MobileNumber { get; set; }
    public string? Description { get; set; }
    public List<string> ProgrammingLanguages { get; set; } = new();
    public List<SkillRatingDto> Skills { get; set; } = new();
    public string? LinkedInUrl { get; set; }
    public string? GitHubUrl { get; set; }
    public string? ResumeUrl { get; set; }
    public string? ResumeFileName { get; set; }
    public string? ProfilePhotoUrl { get; set; }
    public bool ConsentToShareData { get; set; }
    public bool MatchWithTeam { get; set; }
    public bool InterestedInFellowship { get; set; }
    public bool SubscribeToNewsletter { get; set; }
    public DateTimeOffset CreatedAt { get; set; }
}

public class AuthResponse
{
    public string Token { get; set; } = string.Empty;
    public DateTimeOffset ExpiresAt { get; set; }
    public ProfileResponse Profile { get; set; } = default!;
}
