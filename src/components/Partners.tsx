"use client";

import Image from "next/image";
import { useState } from "react";

const PARTNERS = [
  {
    name: "NIBM",
    logo: "https://d1lmq142maiv1z.cloudfront.net/Untitled_1_01_682429d2a3.svg",
    alt: "NIBM - National Institute of Business Management",
    fallback: undefined,
  },
  {
    name: "SLIIT",
    logo: "https://static.sliit.lk/wp-content/uploads/2023/06/06022054/SLIIT-UNI-LOGO.png",
    alt: "SLIIT - Sri Lanka Institute of Information Technology",
    fallback: undefined,
  },
  {
    name: "University of Moratuwa",
    logo: "https://uom.lk/assets/images/logo_0.png",
    alt: "University of Moratuwa",
    fallback: undefined,
  },
  {
    name: "University of Sri Jayewardenepura",
    logo: "https://www.sjp.ac.lk/wp-content/uploads/2019/01/sjp-logo-large-trilingual.png",
    alt: "University of Sri Jayewardenepura",
    fallback: undefined,
  },
  {
    name: "KDU",
    logo: "/partners/kdu.png",
    alt: "General Sir John Kotelawala Defence University",
    fallback: undefined,
  },
  {
    name: "IEEE Sri Lanka",
    logo: "https://ieee.lk/wp-content/uploads/2018/02/logo-transparent.png",
    alt: "IEEE Sri Lanka Section",
    fallback: undefined,
  },
  {
    name: "IEEE Computer Society Sri Lanka",
    logo: "https://www.computer.org/_next/image?url=https%3A%2F%2Fmain-cdn.computer.org%2Fwp-media%2F2022%2F04%2F28195553%2FIEEE-CS_Logo-177x61-2x-orange-white.png&w=384&q=75",
    alt: "IEEE Sri Lanka Section",
    fallback: undefined,
  },
  {
    name: "Informatics Institute of Technology",
    logo: "https://www.iit.ac.lk/wp-content/themes/iitnew/assets/img/logo.png",
    alt: "Informatics Institute of Technology",
    fallback: undefined,
  },
  {
    name: "NSBM Green University",
    logo: "https://www.nsbm.ac.lk/wp-content/uploads/2022/12/logo_nsbm.png",
    alt: "NSBM Green University",
    fallback: undefined,
  },
  {
    name: "SLASSCOM",
    logo: "https://old.slasscom.lk/wp-content/uploads/2023/02/image001.png",
    alt: "SLASSCOM",
    fallback: undefined,
  },
  {
    name: "ICTA",
    logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/10/ICTA_LOGO.gif/500px-ICTA_LOGO.gif",
    alt: "ICTA",
    fallback: undefined,
  },
  {
    name: "University of Colombo",
    logo: "https://cmb.ac.lk/wp-content/uploads/logo-web.png",
    alt: "University of Colombo",
    fallback: undefined,
  },
  {
    name: "University of Kelaniya",
    logo: "/partners/uok.png",
    alt: "University of Kelaniya",
    fallback: undefined,
  },
  {
    name: "University of Ruhuna",
    logo: "https://www.ruh.ac.lk/images/logo_copy.png",
    alt: "University of Ruhuna",
    fallback: undefined,
  },
  {
    name: "University of Peradeniya",
    logo: "/partners/uop.png",
    alt: "University of Peradeniya",
    fallback: undefined,
    removeWhiteBg: true,
  },
  {
    name: "Sabaragamuwa University",
    logo: "https://www.sab.ac.lk/sites/default/files/susl-logo-new.png",
    alt: "Sabaragamuwa University",
    fallback: undefined,
  },
  {
    name: "Uva Wellassa University",
    logo: "https://www.uwu.ac.lk/wp-content/uploads/logo_uwu.jpg",
    alt: "Uva Wellassa University",
    fallback: undefined,
  }
];

function PartnerLogo({
  partner,
}: {
  partner: {
    name: string;
    logo: string;
    alt: string;
    fallback?: string;
    removeWhiteBg?: boolean;
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
        className="flex h-20 w-40 items-center justify-center rounded-lg bg-white/5 sm:h-24 sm:w-56 lg:w-64"
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
      className="group flex h-20 w-40 items-center justify-center sm:h-24 sm:w-56 lg:w-64"
      title={partner.alt}
    >
      <Image
        src={src}
        alt={partner.alt}
        width={260}
        height={104}
        className={`h-16 w-48 object-contain transition-all duration-200 opacity-100 group-hover:scale-[1.03] ${partner.removeWhiteBg ? "mix-blend-multiply" : ""}`}
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
      className="border-t border-white/10 bg-[#181818] py-16 sm:py-20"
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
          className="flex w-max flex-nowrap gap-16 py-6 animate-marquee-left hover:[animation-play-state:paused]"
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
