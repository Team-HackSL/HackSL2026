using Microsoft.Extensions.Options;

namespace HackSL.Portal.Api.Services;

public class StorageOptions
{
    /// <summary>Which IFileStorage to use: "VercelBlob" or "Local".</summary>
    public string Provider { get; set; } = "Local";

    /// <summary>Folder on disk where uploads are written (absolute, or relative to the content root). Local provider only.</summary>
    public string RootPath { get; set; } = "uploads";

    /// <summary>URL path segment the files are served under (matches Program.cs static files mapping). Local provider only.</summary>
    public string RequestPath { get; set; } = "uploads";

    /// <summary>Optional fixed public base URL (e.g. a CDN). When empty the current request host is used. Local provider only.</summary>
    public string? PublicBaseUrl { get; set; }

    /// <summary>Vercel Blob read-write token. Falls back to the BLOB_READ_WRITE_TOKEN environment variable when empty.</summary>
    public string? BlobReadWriteToken { get; set; }
}

public interface IFileStorage
{
    /// <summary>Persists the uploaded file under the given sub-folder and returns a public URL.</summary>
    Task<string> SaveAsync(IFormFile file, string folder, CancellationToken ct = default);

    /// <summary>Deletes a previously stored file by its public URL. No-op for null/empty/unknown URLs.</summary>
    Task DeleteAsync(string? url, CancellationToken ct = default);
}

/// <summary>
/// Stores uploads on the local filesystem. Swap this implementation for S3/Azure Blob/
/// Vercel Blob without touching the controllers - they depend only on IFileStorage.
/// </summary>
public class LocalFileStorage : IFileStorage
{
    private readonly StorageOptions _options;
    private readonly IHttpContextAccessor _http;
    private readonly IWebHostEnvironment _env;

    public LocalFileStorage(IOptions<StorageOptions> options, IHttpContextAccessor http, IWebHostEnvironment env)
    {
        _options = options.Value;
        _http = http;
        _env = env;
    }

    public async Task<string> SaveAsync(IFormFile file, string folder, CancellationToken ct = default)
    {
        var root = Path.IsPathRooted(_options.RootPath)
            ? _options.RootPath
            : Path.Combine(_env.ContentRootPath, _options.RootPath);

        var targetDir = Path.Combine(root, folder);
        Directory.CreateDirectory(targetDir);

        var extension = Path.GetExtension(file.FileName);
        var storedName = $"{Guid.NewGuid():N}{extension}";
        var fullPath = Path.Combine(targetDir, storedName);

        await using (var stream = File.Create(fullPath))
        {
            await file.CopyToAsync(stream, ct);
        }

        var request = _http.HttpContext?.Request;
        var baseUrl = !string.IsNullOrWhiteSpace(_options.PublicBaseUrl)
            ? _options.PublicBaseUrl!.TrimEnd('/')
            : request is not null ? $"{request.Scheme}://{request.Host}" : string.Empty;

        var requestPath = _options.RequestPath.Trim('/');
        return $"{baseUrl}/{requestPath}/{folder}/{storedName}";
    }

    public Task DeleteAsync(string? url, CancellationToken ct = default)
    {
        if (string.IsNullOrWhiteSpace(url)) return Task.CompletedTask;

        var root = Path.IsPathRooted(_options.RootPath)
            ? _options.RootPath
            : Path.Combine(_env.ContentRootPath, _options.RootPath);

        // URL looks like {base}/{requestPath}/{folder}/{file}; map the part after
        // requestPath back to a path under the storage root.
        var requestPath = _options.RequestPath.Trim('/');
        var absolutePath = Uri.TryCreate(url, UriKind.Absolute, out var uri) ? uri.AbsolutePath : url;
        var relative = absolutePath.TrimStart('/');
        if (relative.StartsWith(requestPath + "/", StringComparison.OrdinalIgnoreCase))
            relative = relative[(requestPath.Length + 1)..];

        var fullPath = Path.Combine(root, relative.Replace('/', Path.DirectorySeparatorChar));
        if (File.Exists(fullPath)) File.Delete(fullPath);
        return Task.CompletedTask;
    }
}
