using System.ComponentModel.DataAnnotations;

namespace HackSL.Portal.Api.Dtos;

public class RegisterRequest
{
    [Required, EmailAddress, MaxLength(256)]
    public string Email { get; set; } = string.Empty;

    [Required, MinLength(8), MaxLength(128)]
    public string Password { get; set; } = string.Empty;

    [Required, MaxLength(200)]
    public string FullName { get; set; } = string.Empty;

    [Required]
    public DateOnly DateOfBirth { get; set; }

    [Required, MaxLength(200)]
    public string Institution { get; set; } = string.Empty;

    [MaxLength(4000)]
    public string? Description { get; set; }

    public List<string> ProgrammingLanguages { get; set; } = new();

    public List<SkillRatingDto> Skills { get; set; } = new();

    [Url, MaxLength(500)]
    public string? LinkedInUrl { get; set; }

    [Url, MaxLength(500)]
    public string? GitHubUrl { get; set; }

    /// <summary>Must be true — the user consents to HackSL using their resume/data to share with partners.</summary>
    public bool ConsentToShareData { get; set; }

    /// <summary>Opt-in: match me with a hackathon team.</summary>
    public bool MatchWithTeam { get; set; }

    /// <summary>Opt-in: interested in becoming a HackSL Fellow.</summary>
    public bool InterestedInFellowship { get; set; }

    /// <summary>Opt-in: weekly newsletter.</summary>
    public bool SubscribeToNewsletter { get; set; }
}
