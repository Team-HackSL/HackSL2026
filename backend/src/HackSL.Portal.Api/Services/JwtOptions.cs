namespace HackSL.Portal.Api.Services;

public class JwtOptions
{
    public string Key { get; set; } = string.Empty;
    public string Issuer { get; set; } = "hacksl-portal";
    public string Audience { get; set; } = "hacksl-portal";
    public int ExpiryMinutes { get; set; } = 1440;
}
