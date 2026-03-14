"use client";

import Image from "next/image";
import { useState } from "react";

const TEAM = [
  {
    name: "Santhusha J. Mudannayaka",
    role: "Team",
    placeholder: "SJ",
    image: "/team/santhusha.png",
    linkedIn: "https://www.linkedin.com/in/santhusha-mudannayaka/",
  },
  {
    name: "Kavindu Ranasinghe",
    role: "Team",
    placeholder: "KR",
    image: "/team/kavindu.jpg",
    linkedIn: "https://www.linkedin.com/in/kavindu-ranasinghe/",
  }
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

  const content = (
    <>
      <div className="relative h-28 w-28 overflow-hidden rounded-full bg-[var(--accent)] shadow-lg ring-4 ring-white">
        {!imgError ? (
          <Image
            src={member.image}
            alt={member.name}
            fill
            className="object-cover object-top"
            sizes="112px"
            onError={() => setImgError(true)}
          />
        ) : (
          <span className="flex h-full w-full items-center justify-center text-2xl font-bold text-white">
            {member.placeholder}
          </span>
        )}
      </div>
      <h3 className="mt-4 font-semibold text-[var(--foreground)]">{member.name}</h3>
      <p className="text-sm text-[var(--muted)]">{member.role}</p>
    </>
  );

  return (
    <div className="flex flex-col items-center text-center">
      {member.linkedIn ? (
        <a
          href={member.linkedIn}
          target="_blank"
          rel="noopener noreferrer"
          className="group flex flex-col items-center transition-all duration-200 hover:-translate-y-1 hover:opacity-90"
        >
          {content}
          <span className="mt-2 text-xs text-[var(--accent)] opacity-0 transition-opacity group-hover:opacity-100">
            View LinkedIn →
          </span>
        </a>
      ) : (
        content
      )}
    </div>
  );
}

export function Team() {
  return (
    <section id="team" className="border-t border-[var(--border)] bg-[var(--surface)] py-24">
      <div className="mx-auto max-w-5xl px-6">
        <h2 className="text-center text-3xl font-bold tracking-tight text-[var(--foreground)]">
          Our Team
        </h2>
        <p className="mx-auto mt-4 max-w-2xl text-center text-[var(--muted)]">
          The people behind HackSL, connecting tech innovators across Sri Lanka.
        </p>
        <div className="mt-12 flex flex-wrap justify-center gap-12">
          {TEAM.map((member) => (
            <TeamMember key={member.name} member={member} />
          ))}
        </div>
      </div>
    </section>
  );
}
