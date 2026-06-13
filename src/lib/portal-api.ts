// Client for the HackSL .NET portal backend (see /backend).
// Talks to the ASP.NET Core API; the JWT is kept in localStorage and sent as a Bearer token.

export const PORTAL_API_BASE =
  process.env.NEXT_PUBLIC_PORTAL_API_URL || "http://localhost:5080";

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

async function request<T>(path: string, init: RequestInit = {}): Promise<T> {
  const token = getToken();
  const headers = new Headers(init.headers);
  if (token) headers.set("Authorization", `Bearer ${token}`);

  const res = await fetch(`${PORTAL_API_BASE}${path}`, { ...init, headers });

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
    throw new Error(message);
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
