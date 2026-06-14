using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using HackSL.Portal.Api.Data;
using HackSL.Portal.Api.Dtos;
using HackSL.Portal.Api.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace HackSL.Portal.Api.Controllers;

/// <summary>
/// Tinder-style team matching for users who opted into "Match me with a team".
///
/// The swipe deck only exposes anonymized fields (skills, university, languages,
/// intro, GitHub). A right-swipe is a "like"; the free tier grants a single right-swipe
/// and further likes are gated behind a (not-yet-built) paywall. When two users have
/// both right-swiped each other it becomes a mutual match and their personal details
/// (name, email, LinkedIn) are revealed to one another.
/// </summary>
[ApiController]
[Route("api/match")]
[Authorize]
public class MatchController : ControllerBase
{
    /// <summary>Right-swipes ("matches") included for free. Beyond this, the paywall applies.</summary>
    private const int FreeMatchLimit = 1;

    private readonly AppDbContext _db;

    public MatchController(AppDbContext db) => _db = db;

    /// <summary>Whether the current user can match, and how many free likes they have left.</summary>
    [HttpGet("status")]
    public async Task<ActionResult<MatchStatusResponse>> Status(CancellationToken ct)
    {
        if (!TryGetUserId(out var userId)) return Unauthorized();

        var profile = await _db.Profiles.AsNoTracking().FirstOrDefaultAsync(p => p.UserId == userId, ct);
        if (profile is null) return NotFound();

        var used = await _db.TeamSwipes.CountAsync(s => s.SwiperUserId == userId && s.IsRightSwipe, ct);
        return Ok(new MatchStatusResponse
        {
            MatchWithTeam = profile.MatchWithTeam,
            RightSwipesUsed = used,
            FreeMatchesRemaining = Math.Max(0, FreeMatchLimit - used),
        });
    }

    /// <summary>The deck of people to swipe on (opted-in users the caller hasn't swiped yet).</summary>
    [HttpGet("candidates")]
    public async Task<ActionResult<List<MatchCandidateResponse>>> Candidates(CancellationToken ct)
    {
        if (!TryGetUserId(out var userId)) return Unauthorized();

        var me = await _db.Profiles.AsNoTracking().FirstOrDefaultAsync(p => p.UserId == userId, ct);
        if (me is null) return NotFound();
        if (!me.MatchWithTeam)
            return StatusCode(403, new { error = "Enable \"Match me with a team\" on your profile first." });

        var swipedTargetIds = await _db.TeamSwipes
            .Where(s => s.SwiperUserId == userId)
            .Select(s => s.TargetUserId)
            .ToListAsync(ct);

        var candidates = await _db.Profiles
            .AsNoTracking()
            .Include(p => p.Skills)
            .Where(p => p.MatchWithTeam
                        && p.UserId != userId
                        && !swipedTargetIds.Contains(p.UserId))
            .OrderByDescending(p => p.CreatedAt)
            .ToListAsync(ct);

        var result = candidates.Select(ToCandidate).ToList();
        return Ok(result);
    }

    /// <summary>Record a swipe. direction = "right" (like) or "left" (skip).</summary>
    [HttpPost("swipe")]
    public async Task<ActionResult<SwipeResponse>> Swipe([FromBody] SwipeRequest req, CancellationToken ct)
    {
        if (!TryGetUserId(out var userId)) return Unauthorized();
        if (req.TargetUserId == userId)
            return BadRequest(new { error = "You can't swipe on yourself." });

        var isRight = string.Equals(req.Direction, "right", StringComparison.OrdinalIgnoreCase);

        var me = await _db.Profiles.AsNoTracking().FirstOrDefaultAsync(p => p.UserId == userId, ct);
        if (me is null) return NotFound();
        if (!me.MatchWithTeam)
            return StatusCode(403, new { error = "Enable \"Match me with a team\" on your profile first." });

        var target = await _db.Users
            .Include(u => u.Profile!).ThenInclude(p => p.Skills)
            .FirstOrDefaultAsync(u => u.Id == req.TargetUserId, ct);
        if (target?.Profile is null || !target.Profile.MatchWithTeam)
            return NotFound(new { error = "That person is no longer available to match." });

        var existing = await _db.TeamSwipes
            .FirstOrDefaultAsync(s => s.SwiperUserId == userId && s.TargetUserId == req.TargetUserId, ct);

        var usedRightSwipes = await _db.TeamSwipes
            .CountAsync(s => s.SwiperUserId == userId && s.IsRightSwipe, ct);

        // A right-swipe the user hasn't already spent on this person consumes a free match.
        var isNewRight = isRight && (existing is null || !existing.IsRightSwipe);
        if (isNewRight && usedRightSwipes >= FreeMatchLimit)
        {
            return StatusCode(402, new
            {
                error = "You have used your FREE match.",
                paywall = "Paywall coming soon - matching with more people will be a paid feature.",
            });
        }

        if (existing is null)
        {
            _db.TeamSwipes.Add(new TeamSwipe
            {
                SwiperUserId = userId,
                TargetUserId = req.TargetUserId,
                IsRightSwipe = isRight,
                CreatedAt = DateTimeOffset.UtcNow,
            });
        }
        else
        {
            existing.IsRightSwipe = isRight;
            existing.CreatedAt = DateTimeOffset.UtcNow;
        }

        await _db.SaveChangesAsync(ct);

        var usedAfter = usedRightSwipes + (isNewRight ? 1 : 0);
        var response = new SwipeResponse
        {
            FreeMatchesRemaining = Math.Max(0, FreeMatchLimit - usedAfter),
        };

        // A mutual match: the target must have already right-swiped the caller.
        if (isRight)
        {
            var reciprocal = await _db.TeamSwipes.FirstOrDefaultAsync(
                s => s.SwiperUserId == req.TargetUserId && s.TargetUserId == userId && s.IsRightSwipe, ct);
            if (reciprocal is not null)
            {
                response.IsMatch = true;
                response.Match = ToMatch(target, reciprocal.CreatedAt);
            }
        }

        return Ok(response);
    }

    /// <summary>All confirmed mutual matches, with the other person's details revealed.</summary>
    [HttpGet("matches")]
    public async Task<ActionResult<List<MatchResponse>>> Matches(CancellationToken ct)
    {
        if (!TryGetUserId(out var userId)) return Unauthorized();

        // People I right-swiped...
        var myLikes = await _db.TeamSwipes
            .Where(s => s.SwiperUserId == userId && s.IsRightSwipe)
            .Select(s => new { s.TargetUserId, s.CreatedAt })
            .ToListAsync(ct);
        var likedIds = myLikes.Select(l => l.TargetUserId).ToList();
        if (likedIds.Count == 0) return Ok(new List<MatchResponse>());

        // ...who also right-swiped me.
        var theirLikes = await _db.TeamSwipes
            .Where(s => s.IsRightSwipe && s.TargetUserId == userId && likedIds.Contains(s.SwiperUserId))
            .Select(s => new { s.SwiperUserId, s.CreatedAt })
            .ToListAsync(ct);
        var matchedIds = theirLikes.Select(t => t.SwiperUserId).ToHashSet();
        if (matchedIds.Count == 0) return Ok(new List<MatchResponse>());

        var users = await _db.Users
            .AsNoTracking()
            .Include(u => u.Profile!).ThenInclude(p => p.Skills)
            .Where(u => matchedIds.Contains(u.Id) && u.Profile != null)
            .ToListAsync(ct);

        var result = users.Select(u =>
        {
            var mine = myLikes.First(l => l.TargetUserId == u.Id).CreatedAt;
            var theirs = theirLikes.First(t => t.SwiperUserId == u.Id).CreatedAt;
            return ToMatch(u, mine > theirs ? mine : theirs);
        })
        .OrderByDescending(m => m.MatchedAt)
        .ToList();

        return Ok(result);
    }

    private static MatchCandidateResponse ToCandidate(UserProfile p) => new()
    {
        UserId = p.UserId,
        Institution = p.Institution,
        Description = p.Description,
        ProgrammingLanguages = p.ProgrammingLanguages,
        Skills = p.Skills.OrderBy(s => s.Category)
            .Select(s => new SkillRatingDto { Category = s.Category, Level = s.Level }).ToList(),
        GitHubUrl = p.GitHubUrl,
    };

    private static MatchResponse ToMatch(User u, DateTimeOffset matchedAt)
    {
        var p = u.Profile!;
        return new MatchResponse
        {
            UserId = u.Id,
            FullName = p.FullName,
            Email = u.Email,
            LinkedInUrl = p.LinkedInUrl,
            Institution = p.Institution,
            Description = p.Description,
            ProgrammingLanguages = p.ProgrammingLanguages,
            Skills = p.Skills.OrderBy(s => s.Category)
                .Select(s => new SkillRatingDto { Category = s.Category, Level = s.Level }).ToList(),
            GitHubUrl = p.GitHubUrl,
            ProfilePhotoUrl = p.ProfilePhotoUrl,
            MatchedAt = matchedAt,
        };
    }

    private bool TryGetUserId(out Guid userId)
    {
        var sub = User.FindFirstValue(JwtRegisteredClaimNames.Sub)
                  ?? User.FindFirstValue(ClaimTypes.NameIdentifier);
        return Guid.TryParse(sub, out userId);
    }
}
