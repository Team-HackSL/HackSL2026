using System.ComponentModel.DataAnnotations;

namespace HackSL.Portal.Api.Dtos;

public class UpdateProfileRequest
{
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

    public bool ConsentToShareData { get; set; }
    public bool MatchWithTeam { get; set; }
    public bool InterestedInFellowship { get; set; }
    public bool SubscribeToNewsletter { get; set; }
}
