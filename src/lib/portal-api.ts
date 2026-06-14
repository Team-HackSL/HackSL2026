// Client for the HackSL .NET portal backend (see /backend).
// Talks to the ASP.NET Core API; the JWT is kept in localStorage and sent as a Bearer token.

// The deployed portal backend (ASP.NET Core on Google Cloud Run). This is a
// public HTTP endpoint the browser calls directly, so it is safe to ship as the
// production default; set NEXT_PUBLIC_PORTAL_API_URL to override it (e.g. if the
// service is ever moved).
const PRODUCTION_PORTAL_API = "https://hacksl-portal-api-xctfkdmupa-el.a.run.app";

/**
 * Resolve the portal backend base URL.
 *
 * Order of precedence: an explicit `NEXT_PUBLIC_PORTAL_API_URL` build-time value
 * wins; otherwise we use the local .NET dev server on :5080 when running on
 * localhost, and the deployed Cloud Run backend everywhere else. We never return
 * an empty/localhost base in production, which previously caused a confusing
 * `ERR_CONNECTION_REFUSED` plus uncaught promise rejections in the browser.
 */
function resolvePortalApiBase(): string {
  const configured = process.env.NEXT_PUBLIC_PORTAL_API_URL;
  if (configured) return configured;

  if (typeof window !== "undefined") {
    const host = window.location.hostname;
    if (host !== "localhost" && host !== "127.0.0.1") return PRODUCTION_PORTAL_API;
  }
  return "http://localhost:5080";
}

export const PORTAL_API_BASE = resolvePortalApiBase();

const TOKEN_KEY = "hacksl_portal_token";

// The skill sliders shown on signup / profile. Edit this list to add categories.
export const SKILL_CATEGORIES = [
  "Frontend Development",
  "Backend Development",
  "Mobile Development",
  "DevOps / Cloud",
  "UI/UX Design",
  "Data / Machine Learning",
] as const;

export interface SkillRating {
  category: string;
  level: number; // 0-100
}

export interface Profile {
  id: string;
  email: string;
  fullName: string;
  dateOfBirth: string; // yyyy-MM-dd
  institution: string;
  mobileNumber?: string | null;
  description?: string | null;
  programmingLanguages: string[];
  skills: SkillRating[];
  linkedInUrl?: string | null;
  gitHubUrl?: string | null;
  resumeUrl?: string | null;
  resumeFileName?: string | null;
  profilePhotoUrl?: string | null;
  consentToShareData: boolean;
  matchWithTeam: boolean;
  interestedInFellowship: boolean;
  subscribeToNewsletter: boolean;
  createdAt: string;
}

export interface AuthResponse {
  token: string;
  expiresAt: string;
  profile: Profile;
}

export interface RegisterPayload {
  email: string;
  password: string;
  fullName: string;
  dateOfBirth: string;
  institution: string;
  mobileNumber?: string;
  description?: string;
  programmingLanguages: string[];
  skills: SkillRating[];
  linkedInUrl?: string;
  gitHubUrl?: string;
  consentToShareData: boolean;
  matchWithTeam: boolean;
  interestedInFellowship: boolean;
  subscribeToNewsletter: boolean;
}

export type UpdateProfilePayload = Omit<RegisterPayload, "email" | "password">;

// ---- token storage -------------------------------------------------------

export function getToken(): string | null {
  if (typeof window === "undefined") return null;
  return window.localStorage.getItem(TOKEN_KEY);
}

export function setToken(token: string): void {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(TOKEN_KEY, token);
}

export function clearToken(): void {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(TOKEN_KEY);
}

// ---- low-level request helper -------------------------------------------

/** Error thrown by the portal API client; carries the HTTP status so callers
 *  can distinguish cases like the 402 paywall from ordinary failures. */
export class PortalApiError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.name = "PortalApiError";
    this.status = status;
  }
}

async function request<T>(path: string, init: RequestInit = {}): Promise<T> {
  if (!PORTAL_API_BASE) {
    throw new PortalApiError(
      "The HackSL portal is not available right now. Please try again later.",
      503
    );
  }

  const token = getToken();
  const headers = new Headers(init.headers);
  if (token) headers.set("Authorization", `Bearer ${token}`);

  let res: Response;
  try {
    res = await fetch(`${PORTAL_API_BASE}${path}`, { ...init, headers });
  } catch {
    // Network error (backend down/unreachable) - surface a friendly message
    // rather than letting the raw fetch rejection bubble up to the console.
    throw new PortalApiError(
      "Could not reach the HackSL portal. Please try again later.",
      503
    );
  }

  if (res.status === 204) return undefined as T;

  let data: unknown = null;
  const text = await res.text();
  if (text) {
    try {
      data = JSON.parse(text);
    } catch {
      data = text;
    }
  }

  if (!res.ok) {
    const message =
      (data && typeof data === "object" && "error" in data
        ? String((data as { error: unknown }).error)
        : null) ||
      (typeof data === "string" && data) ||
      `Request failed (${res.status})`;
    throw new PortalApiError(message, res.status);
  }

  return data as T;
}

// ---- endpoints -----------------------------------------------------------

export async function register(payload: RegisterPayload): Promise<AuthResponse> {
  const auth = await request<AuthResponse>("/api/auth/register", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  setToken(auth.token);
  return auth;
}

export async function login(email: string, password: string): Promise<AuthResponse> {
  const auth = await request<AuthResponse>("/api/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  setToken(auth.token);
  return auth;
}

export function getMe(): Promise<Profile> {
  return request<Profile>("/api/profile/me");
}

export function updateProfile(payload: UpdateProfilePayload): Promise<Profile> {
  return request<Profile>("/api/profile/me", {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
}

export async function deleteProfile(): Promise<void> {
  await request<void>("/api/profile/me", { method: "DELETE" });
  clearToken();
}

export function uploadResume(file: File): Promise<Profile> {
  const form = new FormData();
  form.append("file", file);
  return request<Profile>("/api/profile/resume", { method: "POST", body: form });
}

export function uploadPhoto(file: File): Promise<Profile> {
  const form = new FormData();
  form.append("file", file);
  return request<Profile>("/api/profile/photo", { method: "POST", body: form });
}

// ---- team matching -------------------------------------------------------

/** An anonymized candidate in the swipe deck - no name, email, LinkedIn or photo. */
export interface MatchCandidate {
  userId: string;
  institution: string;
  description?: string | null;
  programmingLanguages: string[];
  skills: SkillRating[];
  gitHubUrl?: string | null;
}

/** A confirmed mutual match - personal details are revealed once both swipe right. */
export interface Match {
  userId: string;
  fullName: string;
  email: string;
  linkedInUrl?: string | null;
  institution: string;
  description?: string | null;
  programmingLanguages: string[];
  skills: SkillRating[];
  gitHubUrl?: string | null;
  profilePhotoUrl?: string | null;
  matchedAt: string;
}

export interface MatchStatus {
  matchWithTeam: boolean;
  matchesUsed: number;
  freeMatchesRemaining: number;
}

export interface SwipeResult {
  isMatch: boolean;
  match?: Match | null;
  freeMatchesRemaining: number;
}

export function getMatchStatus(): Promise<MatchStatus> {
  return request<MatchStatus>("/api/match/status");
}

export function getMatchCandidates(): Promise<MatchCandidate[]> {
  return request<MatchCandidate[]>("/api/match/candidates");
}

export function getMatches(): Promise<Match[]> {
  return request<Match[]>("/api/match/matches");
}

export function swipe(targetUserId: string, direction: "left" | "right"): Promise<SwipeResult> {
  return request<SwipeResult>("/api/match/swipe", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ targetUserId, direction }),
  });
}
