"use client";

import Image from "next/image";
import { useState } from "react";

const PARTNERS = [
  {
    name: "NIBM",
    logo: "https://d1lmq142maiv1z.cloudfront.net/Untitled_1_01_682429d2a3.svg",
    alt: "NIBM - National Institute of Business Management",
    fallback: "/partners/nibm.svg",
  },
  {
    name: "SLIIT",
    logo: "https://static.sliit.lk/wp-content/uploads/2023/06/06022054/SLIIT-UNI-LOGO.png",
    alt: "SLIIT - Sri Lanka Institute of Information Technology",
    fallback: "/partners/sliit.png",
  },
  {
    name: "University of Moratuwa",
    logo: "https://uom.lk/assets/images/logo_0.png",
    alt: "University of Moratuwa",
    fallback: "/partners/uom.png",
  },
  {
    name: "University of Sri Jayewardenepura",
    logo: "https://www.sjp.ac.lk/wp-content/uploads/2019/01/sjp-logo-large-trilingual.png",
    alt: "University of Sri Jayewardenepura",
    fallback: "/partners/usj.png",
  },
  {
    name: "KDU",
    logo: "https://kdu.ac.lk/wp-content/uploads/2023/06/kdu-logo2.png",
    alt: "General Sir John Kotelawala Defence University",
    fallback: "/partners/kdu.png",
  },
  {
    name: "IEEE Sri Lanka",
    logo: "https://cdn.simpleicons.org/ieee/0088CC",
    alt: "IEEE Sri Lanka Section",
    fallback: "/partners/ieee.svg",
  },
];

function PartnerLogo({
  partner,
}: {
  partner: {
    name: string;
    logo: string;
    alt: string;
    fallback?: string;
  };
}) {
  const [src, setSrc] = useState(partner.logo);
  const [hasError, setHasError] = useState(false);
  const initials = partner.name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 3);

  const handleError = () => {
    if (partner.fallback && src === partner.logo) {
      setSrc(partner.fallback);
    } else {
      setHasError(true);
    }
  };

  if (hasError) {
    return (
      <div
        className="flex h-10 w-32 items-center justify-center"
        title={partner.alt}
      >
        <span className="text-sm font-medium tracking-wide text-white/70">
          {initials}
        </span>
      </div>
    );
  }

  return (
    <div
      className="flex h-10 w-32 items-center justify-center"
      title={partner.alt}
    >
      <Image
        src={src}
        alt={partner.alt}
        width={120}
        height={48}
        className="h-8 w-auto max-w-[120px] object-contain brightness-0 invert opacity-70"
        onError={handleError}
        unoptimized={src.startsWith("http")}
      />
    </div>
  );
}

export function Partners() {
  const duplicated = [...PARTNERS, ...PARTNERS];

  return (
    <section
      id="partners"
      className="border-t border-white/10 bg-[var(--dark)] py-20"
    >
      <div className="mx-auto max-w-6xl px-6">
        <h2 className="text-center text-2xl font-bold tracking-tight text-white">
          Our Partners
        </h2>
        <p className="mx-auto mt-2 max-w-xl text-center text-sm text-white/70">
          Organizations and universities we&apos;ve partnered with
        </p>
      </div>
      <div className="relative mt-14 overflow-hidden">
        <div
          className="flex w-max flex-nowrap gap-16 py-6 animate-marquee-left"
          style={{ width: "max-content" }}
        >
          {duplicated.map((partner, i) => (
            <PartnerLogo key={`${partner.name}-${i}`} partner={partner} />
          ))}
        </div>
      </div>
    </section>
  );
}
