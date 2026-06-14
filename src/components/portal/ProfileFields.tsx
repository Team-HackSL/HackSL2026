"use client";

import { useState } from "react";
import { SKILL_CATEGORIES } from "@/lib/portal-api";
import type { Profile, SkillRating } from "@/lib/portal-api";

export interface ProfileFormState {
  fullName: string;
  dateOfBirth: string;
  institution: string;
  mobileCountryCode: string;
  mobileNumber: string;
  description: string;
  programmingLanguages: string[];
  skills: Record<string, number>;
  linkedInUrl: string;
  gitHubUrl: string;
  consentToShareData: boolean;
  matchWithTeam: boolean;
  interestedInFellowship: boolean;
  subscribeToNewsletter: boolean;
}

// Dial codes offered in the mobile-number picker. Sri Lanka leads as the
// default since that's where most participants are. One entry per dial code.
export const COUNTRY_DIAL_CODES: { iso: string; label: string; dial: string }[] = [
  { iso: "LK", label: "Sri Lanka", dial: "+94" },
  { iso: "IN", label: "India", dial: "+91" },
  { iso: "US", label: "United States / Canada", dial: "+1" },
  { iso: "GB", label: "United Kingdom", dial: "+44" },
  { iso: "AU", label: "Australia", dial: "+61" },
  { iso: "NZ", label: "New Zealand", dial: "+64" },
  { iso: "SG", label: "Singapore", dial: "+65" },
  { iso: "MY", label: "Malaysia", dial: "+60" },
  { iso: "AE", label: "United Arab Emirates", dial: "+971" },
  { iso: "SA", label: "Saudi Arabia", dial: "+966" },
  { iso: "QA", label: "Qatar", dial: "+974" },
  { iso: "DE", label: "Germany", dial: "+49" },
  { iso: "FR", label: "France", dial: "+33" },
  { iso: "NL", label: "Netherlands", dial: "+31" },
  { iso: "SE", label: "Sweden", dial: "+46" },
  { iso: "JP", label: "Japan", dial: "+81" },
  { iso: "CN", label: "China", dial: "+86" },
  { iso: "KR", label: "South Korea", dial: "+82" },
  { iso: "BD", label: "Bangladesh", dial: "+880" },
  { iso: "PK", label: "Pakistan", dial: "+92" },
  { iso: "NP", label: "Nepal", dial: "+977" },
  { iso: "MV", label: "Maldives", dial: "+960" },
  { iso: "ZA", label: "South Africa", dial: "+27" },
  { iso: "NG", label: "Nigeria", dial: "+234" },
  { iso: "KE", label: "Kenya", dial: "+254" },
  { iso: "BR", label: "Brazil", dial: "+55" },
];

const DEFAULT_DIAL_CODE = "+94";

// Split a stored E.164-style number (e.g. "+94712345678") back into a dial code
// and the national portion so the picker can be rehydrated when editing.
function parseMobile(value: string): { code: string; national: string } {
  const v = value.trim();
  if (!v) return { code: DEFAULT_DIAL_CODE, national: "" };
  // Match the longest dial code first so e.g. +94 wins over +9.
  const dials = COUNTRY_DIAL_CODES.map((c) => c.dial).sort((a, b) => b.length - a.length);
  const match = dials.find((d) => v.startsWith(d));
  if (match) return { code: match, national: v.slice(match.length).replace(/^[\s-]+/, "") };
  // Legacy value without a recognised code: keep its digits, default the code.
  return { code: DEFAULT_DIAL_CODE, national: v.replace(/^\+/, "") };
}

export function emptyProfileForm(): ProfileFormState {
  return {
    fullName: "",
    dateOfBirth: "",
    institution: "",
    mobileCountryCode: DEFAULT_DIAL_CODE,
    mobileNumber: "",
    description: "",
    programmingLanguages: [],
    skills: Object.fromEntries(SKILL_CATEGORIES.map((c) => [c, 0])),
    linkedInUrl: "",
    gitHubUrl: "",
    consentToShareData: false,
    matchWithTeam: false,
    interestedInFellowship: false,
    subscribeToNewsletter: false,
  };
}

export function profileToForm(p: Profile): ProfileFormState {
  const skills = Object.fromEntries(SKILL_CATEGORIES.map((c) => [c, 0])) as Record<string, number>;
  for (const s of p.skills) skills[s.category] = s.level;
  const mobile = parseMobile(p.mobileNumber ?? "");
  return {
    fullName: p.fullName,
    dateOfBirth: p.dateOfBirth,
    institution: p.institution,
    mobileCountryCode: mobile.code,
    mobileNumber: mobile.national,
    description: p.description ?? "",
    programmingLanguages: p.programmingLanguages,
    skills,
    linkedInUrl: p.linkedInUrl ?? "",
    gitHubUrl: p.gitHubUrl ?? "",
    consentToShareData: p.consentToShareData,
    matchWithTeam: p.matchWithTeam,
    interestedInFellowship: p.interestedInFellowship,
    subscribeToNewsletter: p.subscribeToNewsletter,
  };
}

export function formToProfileFields(s: ProfileFormState) {
  const skills: SkillRating[] = SKILL_CATEGORIES.map((c) => ({
    category: c,
    level: s.skills[c] ?? 0,
  })).filter((sk) => sk.level > 0);

  // Combine the dial code and national digits into a single E.164-style value
  // (e.g. "+94712345678"); omit entirely when no number was entered.
  const nationalDigits = s.mobileNumber.replace(/\D/g, "");

  return {
    fullName: s.fullName.trim(),
    dateOfBirth: s.dateOfBirth,
    institution: s.institution.trim(),
    mobileNumber: nationalDigits ? `${s.mobileCountryCode}${nationalDigits}` : undefined,
    description: s.description.trim() || undefined,
    programmingLanguages: s.programmingLanguages,
    skills,
    linkedInUrl: s.linkedInUrl.trim() || undefined,
    gitHubUrl: s.gitHubUrl.trim() || undefined,
    consentToShareData: s.consentToShareData,
    matchWithTeam: s.matchWithTeam,
    interestedInFellowship: s.interestedInFellowship,
    subscribeToNewsletter: s.subscribeToNewsletter,
  };
}

const fieldBase =
  "rounded-lg border border-[var(--border)] bg-[var(--background)] px-3 py-2 text-[var(--foreground)]";
const inputClass = "mt-1 w-full " + fieldBase;
const labelClass = "block text-sm font-medium text-[var(--foreground)]";

function Toggle({
  checked,
  onChange,
  title,
  description,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
  title: string;
  description: string;
}) {
  return (
    <label className="flex cursor-pointer items-start gap-3 rounded-lg border border-[var(--border)] p-4">
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="mt-1 h-4 w-4 accent-[var(--accent)]"
      />
      <span>
        <span className="block text-sm font-medium text-[var(--foreground)]">{title}</span>
        <span className="block text-sm text-[var(--muted)]">{description}</span>
      </span>
    </label>
  );
}

export function ProfileFields({
  state,
  onChange,
}: {
  state: ProfileFormState;
  onChange: (next: ProfileFormState) => void;
}) {
  const [langInput, setLangInput] = useState("");
  const set = (patch: Partial<ProfileFormState>) => onChange({ ...state, ...patch });

  const addLanguage = () => {
    const value = langInput.trim();
    if (!value) return;
    if (!state.programmingLanguages.some((l) => l.toLowerCase() === value.toLowerCase())) {
      set({ programmingLanguages: [...state.programmingLanguages, value] });
    }
    setLangInput("");
  };

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="fullName" className={labelClass}>Full name</label>
          <input
            id="fullName"
            value={state.fullName}
            onChange={(e) => set({ fullName: e.target.value })}
            required
            className={inputClass}
          />
        </div>
        <div>
          <label htmlFor="dob" className={labelClass}>Date of birth</label>
          <input
            id="dob"
            type="date"
            value={state.dateOfBirth}
            onChange={(e) => set({ dateOfBirth: e.target.value })}
            required
            className={inputClass}
          />
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="institution" className={labelClass}>University / School</label>
          <input
            id="institution"
            value={state.institution}
            onChange={(e) => set({ institution: e.target.value })}
            required
            className={inputClass}
          />
        </div>
        <div>
          <label htmlFor="mobileNumber" className={labelClass}>
            Mobile number <span className="font-normal text-[var(--muted)]">(optional)</span>
          </label>
          <div className="mt-1 flex min-w-0 gap-2">
            <select
              aria-label="Country dialing code"
              value={state.mobileCountryCode}
              onChange={(e) => set({ mobileCountryCode: e.target.value })}
              className={`${fieldBase} w-36 shrink-0`}
            >
              {COUNTRY_DIAL_CODES.map((c) => (
                <option key={c.iso} value={c.dial}>
                  {c.dial} {c.label}
                </option>
              ))}
            </select>
            <input
              id="mobileNumber"
              type="tel"
              value={state.mobileNumber}
              onChange={(e) => set({ mobileNumber: e.target.value })}
              autoComplete="tel-national"
              inputMode="tel"
              placeholder="71 234 5678"
              className={`${fieldBase} min-w-0 flex-1`}
            />
          </div>
        </div>
      </div>

      {/* About you / achievements - used for team matching */}
      <div>
        <label htmlFor="description" className={labelClass}>
          About you <span className="font-normal text-[var(--muted)]">(optional)</span>
        </label>
        <p className="text-sm text-[var(--muted)]">
          Introduce yourself and share your past hackathon achievements. If you opt in to team
          matching below, we&apos;ll use this to help match you with a team.
        </p>
        <textarea
          id="description"
          value={state.description}
          onChange={(e) => set({ description: e.target.value })}
          rows={4}
          maxLength={4000}
          placeholder="e.g. Final-year CS student, won HackSL 2025 and built an AI study tool. I love front-end work and mentoring first-time hackers."
          className={inputClass + " resize-y"}
        />
      </div>

      {/* Programming languages */}
      <div>
        <label className={labelClass}>Programming languages</label>
        <div className="mt-1 flex gap-2">
          <input
            value={langInput}
            onChange={(e) => setLangInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                addLanguage();
              }
            }}
            placeholder="e.g. TypeScript, then press Enter"
            className={inputClass + " mt-0"}
          />
          <button
            type="button"
            onClick={addLanguage}
            className="shrink-0 rounded-lg border border-[var(--border)] px-4 text-sm font-medium text-[var(--foreground)] hover:bg-[var(--surface)]"
          >
            Add
          </button>
        </div>
        {state.programmingLanguages.length > 0 && (
          <div className="mt-2 flex flex-wrap gap-2">
            {state.programmingLanguages.map((lang) => (
              <span
                key={lang}
                className="inline-flex items-center gap-1 rounded-full bg-[var(--surface)] px-3 py-1 text-sm text-[var(--foreground)]"
              >
                {lang}
                <button
                  type="button"
                  aria-label={`Remove ${lang}`}
                  onClick={() =>
                    set({ programmingLanguages: state.programmingLanguages.filter((l) => l !== lang) })
                  }
                  className="text-[var(--muted)] hover:text-[var(--foreground)]"
                >
                  ×
                </button>
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Skill sliders */}
      <div>
        <label className={labelClass}>Skills</label>
        <p className="text-sm text-[var(--muted)]">Drag each slider to rate yourself (0–100).</p>
        <div className="mt-3 space-y-4">
          {SKILL_CATEGORIES.map((category) => (
            <div key={category}>
              <div className="flex items-center justify-between text-sm">
                <span className="text-[var(--foreground)]">{category}</span>
                <span className="font-mono text-[var(--muted)]">{state.skills[category] ?? 0}</span>
              </div>
              <input
                type="range"
                min={0}
                max={100}
                value={state.skills[category] ?? 0}
                onChange={(e) => set({ skills: { ...state.skills, [category]: Number(e.target.value) } })}
                className="mt-1 w-full accent-[var(--accent)]"
              />
            </div>
          ))}
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="linkedin" className={labelClass}>LinkedIn URL</label>
          <input
            id="linkedin"
            type="url"
            value={state.linkedInUrl}
            onChange={(e) => set({ linkedInUrl: e.target.value })}
            placeholder="https://linkedin.com/in/…"
            className={inputClass}
          />
        </div>
        <div>
          <label htmlFor="github" className={labelClass}>GitHub URL</label>
          <input
            id="github"
            type="url"
            value={state.gitHubUrl}
            onChange={(e) => set({ gitHubUrl: e.target.value })}
            placeholder="https://github.com/…"
            className={inputClass}
          />
        </div>
      </div>

      {/* Opt-ins */}
      <div className="space-y-3">
        <Toggle
          checked={state.matchWithTeam}
          onChange={(v) => set({ matchWithTeam: v })}
          title="Match me with a team"
          description="We'll use your data to match you with a hackathon team if you don't have one or want to join a new one."
        />
        <Toggle
          checked={state.interestedInFellowship}
          onChange={(v) => set({ interestedInFellowship: v })}
          title="I'm interested in becoming a HackSL Fellow"
          description="Show your interest in the HackSL Fellowship program."
        />
        <Toggle
          checked={state.subscribeToNewsletter}
          onChange={(v) => set({ subscribeToNewsletter: v })}
          title="Subscribe to the weekly newsletter"
          description="Get a weekly email with upcoming hackathons, that week's blog posts, and last week's hackathon winners."
        />
        <Toggle
          checked={state.consentToShareData}
          onChange={(v) => set({ consentToShareData: v })}
          title="I consent to HackSL using my resume & data"
          description="We may share your resume and profile with partners so you can benefit from job offers, internships, and similar opportunities. Required to create a profile."
        />
      </div>
    </div>
  );
}
