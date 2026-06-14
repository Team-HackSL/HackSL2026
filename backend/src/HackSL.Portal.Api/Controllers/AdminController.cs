using System.Security.Cryptography;
using System.Text;
using HackSL.Portal.Api.Data;
using HackSL.Portal.Api.Dtos;
using HackSL.Portal.Api.Services;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace HackSL.Portal.Api.Controllers;

/// <summary>
/// Admin-only endpoints to view and remove members. Protected by a shared admin secret
/// (config "Admin:Secret" or env HACKSL_ADMIN_SECRET) sent in the "X-Admin-Secret" header.
/// Intended to be called server-to-server from the Next.js admin (which checks its own session).
/// </summary>
[ApiController]
[Route("api/admin")]
public class AdminController : ControllerBase
{
    private readonly AppDbContext _db;
    private readonly IFileStorage _storage;
    private readonly IConfiguration _config;

    public AdminController(AppDbContext db, IFileStorage storage, IConfiguration config)
    {
        _db = db;
        _storage = storage;
        _config = config;
    }

    private bool IsAdmin()
    {
        var expected = _config["Admin:Secret"]
            ?? Environment.GetEnvironmentVariable("HACKSL_ADMIN_SECRET")
            ?? "hacksl-admin-2025";
        var provided = Request.Headers["X-Admin-Secret"].FirstOrDefault();
        if (string.IsNullOrEmpty(provided)) return false;
        return CryptographicOperations.FixedTimeEquals(
            Encoding.UTF8.GetBytes(provided), Encoding.UTF8.GetBytes(expected));
    }

    /// <summary>List every member with full profile details (excluding the password hash).</summary>
    [HttpGet("members")]
    public async Task<IActionResult> Members(CancellationToken ct)
    {
        if (!IsAdmin()) return Unauthorized(new { error = "Invalid admin secret." });

        var users = await _db.Users
            .Include(u => u.Profile!).ThenInclude(p => p.Skills)
            .OrderByDescending(u => u.CreatedAt)
            .ToListAsync(ct);

        var members = users
            .Where(u => u.Profile is not null)
            .Select(u =>
            {
                var p = u.Profile!;
                return new AdminMemberResponse
                {
                    UserId = u.Id,
                    Email = u.Email,
                    AccountCreatedAt = u.CreatedAt,
                    FullName = p.FullName,
                    DateOfBirth = p.DateOfBirth,
                    Institution = p.Institution,
                    MobileNumber = p.MobileNumber,
                    Description = p.Description,
                    ProgrammingLanguages = p.ProgrammingLanguages,
                    Skills = p.Skills.OrderBy(s => s.Category)
                        .Select(s => new SkillRatingDto { Category = s.Category, Level = s.Level }).ToList(),
                    LinkedInUrl = p.LinkedInUrl,
                    GitHubUrl = p.GitHubUrl,
                    ResumeUrl = p.ResumeUrl,
                    ResumeFileName = p.ResumeFileName,
                    ProfilePhotoUrl = p.ProfilePhotoUrl,
                    ConsentToShareData = p.ConsentToShareData,
                    MatchWithTeam = p.MatchWithTeam,
                    InterestedInFellowship = p.InterestedInFellowship,
                    SubscribeToNewsletter = p.SubscribeToNewsletter,
                };
            })
            .ToList();

        return Ok(members);
    }

    /// <summary>Remove a member (deletes the account, profile, skills, and uploaded files).</summary>
    [HttpDelete("members/{userId:guid}")]
    public async Task<IActionResult> Remove(Guid userId, CancellationToken ct)
    {
        if (!IsAdmin()) return Unauthorized(new { error = "Invalid admin secret." });

        var user = await _db.Users.Include(u => u.Profile).FirstOrDefaultAsync(u => u.Id == userId, ct);
        if (user is null) return NotFound();

        if (user.Profile is not null)
        {
            try { await _storage.DeleteAsync(user.Profile.ResumeUrl, ct); } catch { /* ignore */ }
            try { await _storage.DeleteAsync(user.Profile.ProfilePhotoUrl, ct); } catch { /* ignore */ }
        }

        _db.Users.Remove(user); // cascades to profile + skills
        await _db.SaveChangesAsync(ct);
        return NoContent();
    }
}
