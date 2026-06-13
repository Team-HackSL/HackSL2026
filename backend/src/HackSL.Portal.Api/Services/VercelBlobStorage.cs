using System.Text.Json;
using Microsoft.Extensions.Options;

namespace HackSL.Portal.Api.Services;

/// <summary>
/// Stores uploads in Vercel Blob via its server-side HTTP API (the same backend the
/// @vercel/blob `put` SDK uses). Matches the existing Next.js site's blob storage.
/// Requires a read-write token (config "Storage:BlobReadWriteToken" or env BLOB_READ_WRITE_TOKEN).
/// </summary>
public class VercelBlobStorage : IFileStorage
{
    private const string ApiBaseUrl = "https://vercel.com/api/blob";
    private const string ApiVersion = "12"; // matches @vercel/blob BLOB_API_VERSION

    private readonly HttpClient _http;
    private readonly StorageOptions _options;

    public VercelBlobStorage(HttpClient http, IOptions<StorageOptions> options)
    {
        _http = http;
        _options = options.Value;
    }

    public async Task<string> SaveAsync(IFormFile file, string folder, CancellationToken ct = default)
    {
        var token = !string.IsNullOrWhiteSpace(_options.BlobReadWriteToken)
            ? _options.BlobReadWriteToken
            : Environment.GetEnvironmentVariable("BLOB_READ_WRITE_TOKEN");

        if (string.IsNullOrWhiteSpace(token))
            throw new InvalidOperationException(
                "Vercel Blob is selected but no token is configured. Set Storage:BlobReadWriteToken or the BLOB_READ_WRITE_TOKEN environment variable.");

        // We generate a unique pathname ourselves, so no random suffix is needed.
        var extension = Path.GetExtension(file.FileName);
        var pathname = $"{folder.Trim('/')}/{Guid.NewGuid():N}{extension}";
        var requestUri = $"{ApiBaseUrl}/?pathname={Uri.EscapeDataString(pathname)}";

        using var content = new StreamContent(file.OpenReadStream());
        using var request = new HttpRequestMessage(HttpMethod.Put, requestUri) { Content = content };
        request.Headers.TryAddWithoutValidation("authorization", $"Bearer {token}");
        request.Headers.TryAddWithoutValidation("x-api-version", ApiVersion);
        request.Headers.TryAddWithoutValidation("x-vercel-blob-access", "public");
        request.Headers.TryAddWithoutValidation("x-add-random-suffix", "0");
        request.Headers.TryAddWithoutValidation(
            "x-content-type",
            string.IsNullOrWhiteSpace(file.ContentType) ? "application/octet-stream" : file.ContentType);

        using var response = await _http.SendAsync(request, ct);
        var body = await response.Content.ReadAsStringAsync(ct);

        if (!response.IsSuccessStatusCode)
            throw new InvalidOperationException(
                $"Vercel Blob upload failed ({(int)response.StatusCode}): {body}");

        using var doc = JsonDocument.Parse(body);
        return doc.RootElement.GetProperty("url").GetString()
            ?? throw new InvalidOperationException("Vercel Blob response did not include a url.");
    }

    public async Task DeleteAsync(string? url, CancellationToken ct = default)
    {
        if (string.IsNullOrWhiteSpace(url)) return;

        var token = !string.IsNullOrWhiteSpace(_options.BlobReadWriteToken)
            ? _options.BlobReadWriteToken
            : Environment.GetEnvironmentVariable("BLOB_READ_WRITE_TOKEN");
        if (string.IsNullOrWhiteSpace(token)) return; // nothing we can do without a token

        using var content = new StringContent(
            JsonSerializer.Serialize(new { urls = new[] { url } }), System.Text.Encoding.UTF8, "application/json");
        using var request = new HttpRequestMessage(HttpMethod.Post, $"{ApiBaseUrl}/delete") { Content = content };
        request.Headers.TryAddWithoutValidation("authorization", $"Bearer {token}");
        request.Headers.TryAddWithoutValidation("x-api-version", ApiVersion);

        using var response = await _http.SendAsync(request, ct);
        // Best-effort cleanup: deleting blobs must not block account deletion.
    }
}
