using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using HackSL.Portal.Api.Data;
using HackSL.Portal.Api.Dtos;
using HackSL.Portal.Api.Models;
using HackSL.Portal.Api.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace HackSL.Portal.Api.Controllers;

[ApiController]
[Route("api/profile")]
[Authorize]
public class ProfileController : ControllerBase
{
    private static readonly string[] AllowedResumeTypes =
        { "application/pdf", "application/msword",
          "application/vnd.openxmlformats-officedocument.wordprocessingml.document" };

    private static readonly string[] AllowedImageTypes =
        { "image/jpeg", "image/png", "image/webp", "image/gif" };

    private const long MaxResumeBytes = 10 * 1024 * 1024; // 10 MB
    private const long MaxPhotoBytes = 5 * 1024 * 1024;   // 5 MB

    private readonly AppDbContext _db;
    private readonly IFileStorage _storage;

    public ProfileController(AppDbContext db, IFileStorage storage)
    {
        _db = db;
        _storage = storage;
    }

    /// <summary>Get the signed-in user's profile.</summary>
    [HttpGet("me")]
    public async Task<ActionResult<ProfileResponse>> Me(CancellationToken ct)
    {
        var user = await LoadCurrentUserAsync(ct);
        return user?.Profile is null ? NotFound() : Ok(user.ToResponse());
    }

    /// <summary>Update the signed-in user's profile (replaces skills and languages).</summary>
    [HttpPut("me")]
    public async Task<ActionResult<ProfileResponse>> Update([FromBody] UpdateProfileRequest req, CancellationToken ct)
    {
        var user = await LoadCurrentUserAsync(ct);
        if (user?.Profile is null) return NotFound();

        var p = user.Profile;
        p.FullName = req.FullName.Trim();
        p.DateOfBirth = req.DateOfBirth;
        p.Institution = req.Institution.Trim();
        p.MobileNumber = string.IsNullOrWhiteSpace(req.MobileNumber) ? null : req.MobileNumber.Trim();
        p.Description = string.IsNullOrWhiteSpace(req.Description) ? null : req.Description.Trim();
        p.ProgrammingLanguages = req.ProgrammingLanguages
            .Select(l => l.Trim()).Where(l => l.Length > 0)
            .Distinct(StringComparer.OrdinalIgnoreCase).ToList();
        p.LinkedInUrl = req.LinkedInUrl;
        p.GitHubUrl = req.GitHubUrl;
        p.ConsentToShareData = req.ConsentToShareData;
        p.MatchWithTeam = req.MatchWithTeam;
        p.InterestedInFellowship = req.InterestedInFellowship;
        p.SubscribeToNewsletter = req.SubscribeToNewsletter;
        p.UpdatedAt = DateTimeOffset.UtcNow;

        // Merge skills in place rather than delete-all-then-reinsert: update existing
        // categories, remove ones that are gone, add new ones. Mutating the tracked
        // collection (instead of reassigning it) avoids EF concurrency exceptions.
        var incoming = req.Skills
            .Select(s => new { Category = s.Category.Trim(), s.Level })
            .Where(s => s.Category.Length > 0)
            .GroupBy(s => s.Category, StringComparer.OrdinalIgnoreCase)
            .ToDictionary(g => g.Key, g => g.Last().Level, StringComparer.OrdinalIgnoreCase);

        foreach (var existing in p.Skills.ToList())
        {
            if (incoming.TryGetValue(existing.Category, out var level))
            {
                existing.Level = level;            // update in place
                incoming.Remove(existing.Category);
            }
            else
            {
                p.Skills.Remove(existing);          // category removed
                _db.SkillRatings.Remove(existing);
            }
        }

        foreach (var (category, level) in incoming)  // newly added categories
            p.Skills.Add(new SkillRating { Category = category, Level = level, ProfileId = p.Id });

        await _db.SaveChangesAsync(ct);
        return Ok(user.ToResponse());
    }

    /// <summary>Permanently delete the signed-in user's account, profile, skills, and uploaded files.</summary>
    [HttpDelete("me")]
    public async Task<IActionResult> Delete(CancellationToken ct)
    {
        var user = await LoadCurrentUserAsync(ct);
        if (user is null) return NotFound();

        // Best-effort: remove uploaded resume/photo from storage before deleting the record.
        if (user.Profile is not null)
        {
            try { await _storage.DeleteAsync(user.Profile.ResumeUrl, ct); } catch { /* ignore */ }
            try { await _storage.DeleteAsync(user.Profile.ProfilePhotoUrl, ct); } catch { /* ignore */ }
        }

        _db.Users.Remove(user); // cascades to profile + skills
        await _db.SaveChangesAsync(ct);
        return NoContent();
    }

    /// <summary>Upload (or replace) the resume. multipart/form-data, field name "file".</summary>
    [HttpPost("resume")]
    [RequestSizeLimit(MaxResumeBytes)]
    public async Task<ActionResult<ProfileResponse>> UploadResume(IFormFile file, CancellationToken ct)
    {
        var user = await LoadCurrentUserAsync(ct);
        if (user?.Profile is null) return NotFound();

        var error = ValidateFile(file, AllowedResumeTypes, MaxResumeBytes, "Resume must be a PDF or Word document (max 10 MB).");
        if (error is not null) return BadRequest(new { error });

        var url = await _storage.SaveAsync(file, "resumes", ct);
        user.Profile.ResumeUrl = url;
        user.Profile.ResumeFileName = file.FileName;
        user.Profile.UpdatedAt = DateTimeOffset.UtcNow;
        await _db.SaveChangesAsync(ct);

        return Ok(user.ToResponse());
    }

    /// <summary>Upload (or replace) the profile photo. multipart/form-data, field name "file".</summary>
    [HttpPost("photo")]
    [RequestSizeLimit(MaxPhotoBytes)]
    public async Task<ActionResult<ProfileResponse>> UploadPhoto(IFormFile file, CancellationToken ct)
    {
        var user = await LoadCurrentUserAsync(ct);
        if (user?.Profile is null) return NotFound();

        var error = ValidateFile(file, AllowedImageTypes, MaxPhotoBytes, "Photo must be a JPEG, PNG, WEBP or GIF image (max 5 MB).");
        if (error is not null) return BadRequest(new { error });

        var url = await _storage.SaveAsync(file, "photos", ct);
        user.Profile.ProfilePhotoUrl = url;
        user.Profile.UpdatedAt = DateTimeOffset.UtcNow;
        await _db.SaveChangesAsync(ct);

        return Ok(user.ToResponse());
    }

    private static string? ValidateFile(IFormFile? file, string[] allowedTypes, long maxBytes, string message)
    {
        if (file is null || file.Length == 0) return "No file was provided.";
        if (file.Length > maxBytes) return message;
        if (!allowedTypes.Contains(file.ContentType, StringComparer.OrdinalIgnoreCase)) return message;
        return null;
    }

    private Task<User?> LoadCurrentUserAsync(CancellationToken ct)
    {
        var sub = User.FindFirstValue(JwtRegisteredClaimNames.Sub)
                  ?? User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (!Guid.TryParse(sub, out var userId))
            return Task.FromResult<User?>(null);

        return _db.Users
            .Include(u => u.Profile!)
            .ThenInclude(p => p.Skills)
            .FirstOrDefaultAsync(u => u.Id == userId, ct);
    }
}
