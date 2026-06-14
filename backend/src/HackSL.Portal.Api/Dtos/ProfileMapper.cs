using HackSL.Portal.Api.Models;

namespace HackSL.Portal.Api.Dtos;

public static class ProfileMapper
{
    public static ProfileResponse ToResponse(this User user)
    {
        var p = user.Profile ?? throw new InvalidOperationException("User has no profile loaded.");
        return new ProfileResponse
        {
            Id = p.Id,
            Email = user.Email,
            FullName = p.FullName,
            DateOfBirth = p.DateOfBirth,
            Institution = p.Institution,
            MobileNumber = p.MobileNumber,
            Description = p.Description,
            ProgrammingLanguages = p.ProgrammingLanguages,
            Skills = p.Skills
                .OrderBy(s => s.Category)
                .Select(s => new SkillRatingDto { Category = s.Category, Level = s.Level })
                .ToList(),
            LinkedInUrl = p.LinkedInUrl,
            GitHubUrl = p.GitHubUrl,
            ResumeUrl = p.ResumeUrl,
            ResumeFileName = p.ResumeFileName,
            ProfilePhotoUrl = p.ProfilePhotoUrl,
            ConsentToShareData = p.ConsentToShareData,
            MatchWithTeam = p.MatchWithTeam,
            InterestedInFellowship = p.InterestedInFellowship,
            SubscribeToNewsletter = p.SubscribeToNewsletter,
            CreatedAt = p.CreatedAt,
        };
    }
}
