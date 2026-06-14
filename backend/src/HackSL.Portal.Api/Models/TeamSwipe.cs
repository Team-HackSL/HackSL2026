namespace HackSL.Portal.Api.Models;

/// <summary>
/// A single swipe by one user on another, used by the Tinder-style team matcher.
/// A mutual match exists when two users have both right-swiped on each other.
/// </summary>
public class TeamSwipe
{
    public Guid Id { get; set; } = Guid.NewGuid();

    /// <summary>The user who performed the swipe.</summary>
    public Guid SwiperUserId { get; set; }

    /// <summary>The user who was swiped on.</summary>
    public Guid TargetUserId { get; set; }

    /// <summary>True = "like" (swipe right), false = "skip" (swipe left).</summary>
    public bool IsRightSwipe { get; set; }

    public DateTimeOffset CreatedAt { get; set; } = DateTimeOffset.UtcNow;
}
