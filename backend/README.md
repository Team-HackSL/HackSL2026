# HackSL Portal - Backend (.NET)

ASP.NET Core 8 Web API for the HackSL user portal. Handles sign-up, login, and
the user profile (skills, programming languages, resume/photo uploads, and the
team-matching / fellowship opt-ins).

## Stack

| Concern        | Choice                                            |
| -------------- | ------------------------------------------------- |
| Framework      | ASP.NET Core 8 Web API (controllers)              |
| Database       | PostgreSQL via EF Core (Npgsql)                    |
| Auth           | JWT bearer tokens                                  |
| Passwords      | PBKDF2 / SHA-256, 100k iterations (BCL only)       |
| File storage   | Vercel Blob (default) or local disk - `IFileStorage` |
| API docs       | Swagger UI at `/swagger` (Development)             |

## Prerequisites

- **.NET 8 SDK** - https://dotnet.microsoft.com/download/dotnet/8.0
  (not currently installed on this machine - install it first)
- **PostgreSQL** running and reachable.

## Configure

Edit `src/HackSL.Portal.Api/appsettings.json` (or use user-secrets / env vars):

- `ConnectionStrings:Postgres` - your Postgres connection string.
- `Jwt:Key` - **replace** with a long random secret (≥ 32 chars).
- `Cors:Origins` - the frontend origin(s), e.g. `http://localhost:3000`.
- `Storage:Provider` - `VercelBlob` (default) or `Local`.
- **Vercel Blob token** - set `BLOB_READ_WRITE_TOKEN` in the environment (the same
  token the Next.js site uses, found in `.env.local`), or `Storage:BlobReadWriteToken`.
- `Storage:PublicBaseUrl` - *Local provider only*: leave empty to use the request host.

Tip: keep secrets out of source control with user-secrets:

```bash
cd src/HackSL.Portal.Api
dotnet user-secrets init
dotnet user-secrets set "Jwt:Key" "<a-long-random-secret>"
dotnet user-secrets set "ConnectionStrings:Postgres" "Host=...;Database=...;Username=...;Password=..."
```

## Run

```bash
cd backend
dotnet restore
dotnet run --project src/HackSL.Portal.Api
```

Then open **http://localhost:5080/swagger**.

On startup the app creates the schema automatically (`EnsureCreated`). Once you
introduce EF migrations it switches to `Migrate` instead - see below.

### Optional: use EF Core migrations

```bash
dotnet tool install --global dotnet-ef
cd backend/src/HackSL.Portal.Api
dotnet ef migrations add InitialCreate
dotnet ef database update
```

## API

| Method | Route                  | Auth   | Purpose                                  |
| ------ | ---------------------- | ------ | ---------------------------------------- |
| POST   | `/api/auth/register`   | -      | Sign up: create account + profile        |
| POST   | `/api/auth/login`      | -      | Log in, returns JWT                       |
| GET    | `/api/profile/me`      | Bearer | Get the current user's profile            |
| PUT    | `/api/profile/me`      | Bearer | Update profile (replaces skills/langs)    |
| POST   | `/api/profile/resume`  | Bearer | Upload resume (PDF/DOC/DOCX, ≤ 10 MB)     |
| POST   | `/api/profile/photo`   | Bearer | Upload profile photo (image, ≤ 5 MB)      |

`register` requires `consentToShareData: true`. Skills are sliders
(`{ category, level }`, level 0–100). See `HackSL.Portal.Api.http` for ready-made
requests, or use Swagger.

### Sign-up payload (JSON)

```json
{
  "email": "ada@example.com",
  "password": "supersecret123",
  "fullName": "Ada Lovelace",
  "dateOfBirth": "2002-05-14",
  "institution": "University of Colombo",
  "programmingLanguages": ["TypeScript", "Python", "C#"],
  "skills": [
    { "category": "Frontend Development", "level": 80 },
    { "category": "Backend Development", "level": 65 }
  ],
  "linkedInUrl": "https://www.linkedin.com/in/ada",
  "gitHubUrl": "https://github.com/ada",
  "consentToShareData": true,
  "matchWithTeam": true,
  "interestedInFellowship": true
}
```

Files (resume, photo) are uploaded separately after sign-up using the returned
JWT - `multipart/form-data` with a single field named `file`.

## Project layout

```
src/HackSL.Portal.Api/
  Program.cs            # DI, auth, CORS, swagger, static files, startup migrate
  Controllers/         # AuthController, ProfileController
  Models/              # User, UserProfile, SkillRating (EF entities)
  Dtos/                # request/response shapes + ProfileMapper
  Data/AppDbContext.cs # EF Core model config
  Services/            # PasswordHasher, TokenService (JWT), FileStorage
```

## Notes / next steps

- **Storage**: defaults to **Vercel Blob** (`VercelBlobStorage`), uploading via Vercel
  Blob's server HTTP API with a `BLOB_READ_WRITE_TOKEN` - same store as the Next.js site.
  Switch to `Storage:Provider = "Local"` for local-disk development (served at `/uploads/...`).
  Both implement `IFileStorage`; controllers are unaware of the choice.
- **Email verification, password reset, and rate limiting** are not included yet.
- The frontend is the existing Next.js app (`hacksl-site`); point its portal pages
  at this API's base URL and store the JWT (e.g. httpOnly cookie or memory).
