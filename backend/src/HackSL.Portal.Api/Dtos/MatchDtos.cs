namespace HackSL.Portal.Api.Dtos;

/// <summary>
/// A candidate shown in the swipe deck. Deliberately anonymized: it exposes only
/// skills, university, programming languages, the self-introduction and GitHub.
/// Personal details (name, email, LinkedIn, photo) are withheld until both users match.
/// </summary>
public class MatchCandidateResponse
{
    public Guid UserId { get; set; }
    public string Institution { get; set; } = string.Empty;
    public string? Description { get; set; }
    public List<string> ProgrammingLanguages { get; set; } = new();
    public List<SkillRatingDto> Skills { get; set; } = new();
    public string? GitHubUrl { get; set; }
}

public class SwipeRequest
{
    public Guid TargetUserId { get; set; }
    /// <summary>"right" to like, "left" to skip.</summary>
    public string Direction { get; set; } = "left";
}

public class SwipeResponse
{
    /// <summary>True when this right-swipe completed a mutual match.</summary>
    public bool IsMatch { get; set; }
    /// <summary>Revealed details of the other person, present only when IsMatch is true.</summary>
    public MatchResponse? Match { get; set; }
    /// <summary>How many free right-swipes ("matches") the user has left after this action.</summary>
    public int FreeMatchesRemaining { get; set; }
}

/// <summary>
/// A confirmed mutual match. Because both people swiped right, the previously hidden
/// personal details (name, email, LinkedIn) are revealed alongside the public fields.
/// </summary>
public class MatchResponse
{
    public Guid UserId { get; set; }
    public string FullName { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string? LinkedInUrl { get; set; }
    public string Institution { get; set; } = string.Empty;
    public string? Description { get; set; }
    public List<string> ProgrammingLanguages { get; set; } = new();
    public List<SkillRatingDto> Skills { get; set; } = new();
    public string? GitHubUrl { get; set; }
    public string? ProfilePhotoUrl { get; set; }
    public DateTimeOffset MatchedAt { get; set; }
}

public class MatchStatusResponse
{
    /// <summary>Whether the user opted into team matching.</summary>
    public bool MatchWithTeam { get; set; }
    /// <summary>Right-swipes used so far.</summary>
    public int RightSwipesUsed { get; set; }
    /// <summary>Free right-swipes ("matches") remaining (the free tier grants one).</summary>
    public int FreeMatchesRemaining { get; set; }
}
