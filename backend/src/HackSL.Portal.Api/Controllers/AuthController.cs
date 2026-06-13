using HackSL.Portal.Api.Data;
using HackSL.Portal.Api.Dtos;
using HackSL.Portal.Api.Models;
using HackSL.Portal.Api.Services;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace HackSL.Portal.Api.Controllers;

[ApiController]
[Route("api/auth")]
public class AuthController : ControllerBase
{
    private readonly AppDbContext _db;
    private readonly IPasswordHasher _hasher;
    private readonly ITokenService _tokens;

    public AuthController(AppDbContext db, IPasswordHasher hasher, ITokenService tokens)
    {
        _db = db;
        _hasher = hasher;
        _tokens = tokens;
    }

    /// <summary>Sign up: create an account and profile in one call. Returns a JWT.</summary>
    [HttpPost("register")]
    public async Task<ActionResult<AuthResponse>> Register([FromBody] RegisterRequest req, CancellationToken ct)
    {
        if (!req.ConsentToShareData)
            return BadRequest(new { error = "You must consent to HackSL using your data to create a profile." });

        var email = req.Email.Trim().ToLowerInvariant();
        if (await _db.Users.AnyAsync(u => u.Email == email, ct))
            return Conflict(new { error = "An account with this email already exists." });

        var user = new User
        {
            Email = email,
            PasswordHash = _hasher.Hash(req.Password),
            Profile = new UserProfile
            {
                FullName = req.FullName.Trim(),
                DateOfBirth = req.DateOfBirth,
                Institution = req.Institution.Trim(),
                Description = string.IsNullOrWhiteSpace(req.Description) ? null : req.Description.Trim(),
                ProgrammingLanguages = NormalizeLanguages(req.ProgrammingLanguages),
                LinkedInUrl = req.LinkedInUrl,
                GitHubUrl = req.GitHubUrl,
                ConsentToShareData = req.ConsentToShareData,
                MatchWithTeam = req.MatchWithTeam,
                InterestedInFellowship = req.InterestedInFellowship,
                SubscribeToNewsletter = req.SubscribeToNewsletter,
                Skills = req.Skills
                    .Select(s => new SkillRating { Category = s.Category.Trim(), Level = s.Level })
                    .ToList(),
            },
        };

        _db.Users.Add(user);
        await _db.SaveChangesAsync(ct);

        var (token, expiresAt) = _tokens.CreateToken(user);
        return Ok(new AuthResponse { Token = token, ExpiresAt = expiresAt, Profile = user.ToResponse() });
    }

    /// <summary>Log in with email + password. Returns a JWT and the profile.</summary>
    [HttpPost("login")]
    public async Task<ActionResult<AuthResponse>> Login([FromBody] LoginRequest req, CancellationToken ct)
    {
        var email = req.Email.Trim().ToLowerInvariant();
        var user = await _db.Users
            .Include(u => u.Profile!)
            .ThenInclude(p => p.Skills)
            .FirstOrDefaultAsync(u => u.Email == email, ct);

        if (user is null || !_hasher.Verify(req.Password, user.PasswordHash))
            return Unauthorized(new { error = "Invalid email or password." });

        var (token, expiresAt) = _tokens.CreateToken(user);
        return Ok(new AuthResponse { Token = token, ExpiresAt = expiresAt, Profile = user.ToResponse() });
    }

    private static List<string> NormalizeLanguages(IEnumerable<string> languages) =>
        languages
            .Select(l => l.Trim())
            .Where(l => l.Length > 0)
            .Distinct(StringComparer.OrdinalIgnoreCase)
            .ToList();
}
