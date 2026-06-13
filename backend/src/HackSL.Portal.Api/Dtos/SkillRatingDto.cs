using System.ComponentModel.DataAnnotations;

namespace HackSL.Portal.Api.Dtos;

public class SkillRatingDto
{
    [Required, MaxLength(100)]
    public string Category { get; set; } = string.Empty;

    [Range(0, 100)]
    public int Level { get; set; }
}
