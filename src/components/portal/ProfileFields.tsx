"use client";

import { useState } from "react";
import { SKILL_CATEGORIES } from "@/lib/portal-api";
import type { Profile, SkillRating } from "@/lib/portal-api";

export interface ProfileFormState {
  fullName: string;
  dateOfBirth: string;
  institution: string;
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

export function emptyProfileForm(): ProfileFormState {
  return {
    fullName: "",
    dateOfBirth: "",
    institution: "",
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
  return {
    fullName: p.fullName,
    dateOfBirth: p.dateOfBirth,
    institution: p.institution,
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

  return {
    fullName: s.fullName.trim(),
    dateOfBirth: s.dateOfBirth,
    institution: s.institution.trim(),
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

const inputClass =
  "mt-1 w-full rounded-lg border border-[var(--border)] bg-[var(--background)] px-3 py-2 text-[var(--foreground)]";
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

      {/* About you / achievements — used for team matching */}
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
