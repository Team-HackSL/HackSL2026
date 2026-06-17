"use client";

import Image from "next/image";
import { useState } from "react";

const TEAM = [
  {
    name: "Santhusha J. Mudannayaka",
    role: "Co-Founder",
    placeholder: "SJ",
    image: "/team/santhusha.png",
    linkedIn: "https://www.linkedin.com/in/santhusha-mudannayaka/",
  },
  {
    name: "Kavindu Ranasinghe",
    role: "Co-Founder",
    placeholder: "KR",
    image: "/team/kavindu.jpeg",
    linkedIn: "https://www.linkedin.com/in/kavindu-ranasinghe/",
  },
];

function TeamMember({
  member,
}: {
  member: {
    name: string;
    role: string;
    placeholder: string;
    image: string;
    linkedIn: string;
  };
}) {
  const [imgError, setImgError] = useState(false);

  const inner = (
    <div className="group flex flex-col items-center rounded-2xl border border-[var(--border)] bg-[var(--background)] p-8 text-center shadow-sm transition-all duration-200 hover:-translate-y-1 hover:border-[var(--accent)]/20 hover:shadow-lg">
      <div className="relative h-24 w-24 overflow-hidden rounded-full bg-[var(--accent)] ring-4 ring-[var(--accent)]/10">
        {!imgError ? (
          <Image
            src={member.image}
            alt={member.name}
            fill
            className="object-cover object-top"
            sizes="96px"
            onError={() => setImgError(true)}
          />
        ) : (
          <span className="flex h-full w-full items-center justify-center text-xl font-bold text-white">
            {member.placeholder}
          </span>
        )}
      </div>
      <h3 className="mt-4 font-semibold text-[var(--foreground)]">
        {member.name}
      </h3>
      <p className="mt-1 text-sm text-[var(--muted)]">{member.role}</p>
      {member.linkedIn && (
        <span className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-[var(--accent)] opacity-0 transition-opacity group-hover:opacity-100">
          LinkedIn →
        </span>
      )}
    </div>
  );

  return member.linkedIn ? (
    <a
      href={member.linkedIn}
      target="_blank"
      rel="noopener noreferrer"
      className="block w-48"
    >
      {inner}
    </a>
  ) : (
    <div className="w-48">{inner}</div>
  );
}

export function Team() {
  return (
    <section id="team" className="bg-[var(--surface)] py-24">
      <div className="mx-auto max-w-5xl px-6">
        <div className="text-center">
          <span className="inline-block rounded-full bg-[var(--accent)]/10 px-3 py-1 text-xs font-semibold uppercase tracking-widest text-[var(--accent)]">
            Team
          </span>
          <h2 className="mt-4 text-3xl font-bold tracking-[-0.03em] text-[var(--foreground)]">
            The people behind HackSL
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-[var(--muted)]">
            Volunteers passionate about technology and community, building Sri
            Lanka&apos;s hackathon ecosystem.
          </p>
        </div>
        <div className="mt-12 flex flex-wrap justify-center gap-6">
          {TEAM.map((member) => (
            <TeamMember key={member.name} member={member} />
          ))}
        </div>
      </div>
    </section>
  );
}
