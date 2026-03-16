"use client";

import Image from "next/image";
import { useState, useEffect } from "react";

const SLIDES = [
  {
    src: "https://readme.lk/wp-content/uploads/2021/11/hackathons-in-sri-lanka-1024x576.jpg",
    alt: "Hackathons in Sri Lanka",
  },
  {
    src: "https://scontent-sjc3-1.xx.fbcdn.net/v/t39.30808-6/481046006_1169742411521262_5886700651593229084_n.jpg?_nc_cat=100&ccb=1-7&_nc_sid=13d280&_nc_ohc=k1TCFdE-g9kQ7kNvwHsDcyL&_nc_oc=AdlvhmNiYp8wmzT6aixV9GwLOqB1GiG-lQZ1KByuBqfOnsNnsFYtbGWPBRhdmDZM4Y0528TFaHdcBal8z63pz0As&_nc_zt=23&_nc_ht=scontent-sjc3-1.xx&_nc_gid=qhuE6eGonJy-oQkj9RMHvQ&_nc_ss=8&oh=00_AfxzTwHIe8Z0y4He6jFPQt_VZm8ouhoFLVjMUVWA4TwVhw&oe=69BD8A8F",
    alt: "HackSL community at a hackathon event",
  },
  {
    src: "https://scontent-sjc3-1.xx.fbcdn.net/v/t39.30808-6/476352458_1154717973023706_4221988873061112564_n.jpg?_nc_cat=100&ccb=1-7&_nc_sid=7b2446&_nc_ohc=cmh-ZmHhXSgQ7kNvwGr0NDH&_nc_oc=AdlZZlwh8sha-_g7QxDtHLs6WHfLGpC0se8CbuyOrtkc52XaRKL0K99uSFso79Q29ytvX0M57YNk7eB8HUPtkG4z&_nc_zt=23&_nc_ht=scontent-sjc3-1.xx&_nc_gid=W-kJf0HQon6Tqp8Lrmlqrw&_nc_ss=8&oh=00_AfxxTOx7Rug1vyXd4e-OYk_3hGK0zPaVb7a28zZwLgjwJg&oe=69BD8A08",
    alt: "HackSL community at a hackathon event",
  },
] as const;

export function PhotoCarousel() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const t = setInterval(() => {
      setIndex((i) => (i + 1) % SLIDES.length);
    }, 4000);
    return () => clearInterval(t);
  }, []);

  return (
    <section id="gallery" className="border-t border-[var(--border)] bg-[var(--accent-light)] py-16">
      <div className="mx-auto max-w-5xl px-6">
        <h2 className="text-center text-3xl font-bold tracking-tight text-[var(--foreground)]">
          Moments
        </h2>
        <p className="mx-auto mt-2 max-w-xl text-center text-[var(--muted)]">
          Highlights from hackathons and events we&apos;ve partnered with.
        </p>
        <div className="relative mt-10 overflow-hidden rounded-2xl border border-[var(--border)] bg-white shadow-sm">
          <div className="aspect-video w-full bg-black">
            {SLIDES.map((slide, i) => (
              <div
                key={i}
                className={`absolute inset-0 transition-opacity duration-500 ${
                  i === index ? "opacity-100" : "opacity-0"
                }`}
              >
                <div className="flex h-full w-full items-center justify-center">
                  <Image
                    src={slide.src}
                    alt={slide.alt}
                    width={1280}
                    height={720}
                    className="max-h-full max-w-full object-contain opacity-90"
                  />
                </div>
              </div>
            ))}
          </div>
          <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 gap-2">
            {SLIDES.map((_, i) => (
              <button
                key={i}
                type="button"
                onClick={() => setIndex(i)}
                className={`h-2 w-2 rounded-full transition-all duration-300 ${
                  i === index ? "w-6 bg-[var(--foreground)]" : "bg-[var(--border)] hover:bg-[var(--muted)]"
                }`}
                aria-label={`Go to slide ${i + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
