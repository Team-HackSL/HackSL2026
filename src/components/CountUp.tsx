"use client";

import { useEffect, useRef, useState } from "react";

type CountUpProps = {
  /** Numeric portion to count to, e.g. 50. */
  to: number;
  /** Suffix appended after the number, e.g. "+", "K+". */
  suffix?: string;
  /** Animation duration in ms. */
  duration?: number;
  className?: string;
};

/**
 * Counts from 0 up to `to` once it scrolls into view.
 * Renders the final value immediately under prefers-reduced-motion.
 */
export function CountUp({
  to,
  suffix = "",
  duration = 1400,
  className = "",
}: CountUpProps) {
  const [value, setValue] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const started = useRef(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (prefersReducedMotion) {
      const id = requestAnimationFrame(() => setValue(to));
      return () => cancelAnimationFrame(id);
    }

    const run = () => {
      if (started.current) return;
      started.current = true;
      const start = performance.now();
      const step = (now: number) => {
        const t = Math.min((now - start) / duration, 1);
        // easeOutExpo for a snappy settle
        const eased = t === 1 ? 1 : 1 - Math.pow(2, -10 * t);
        setValue(Math.round(eased * to));
        if (t < 1) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
    };

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          run();
          observer.disconnect();
        }
      },
      { threshold: 0.4 }
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [to, duration]);

  return (
    <span ref={ref} className={className}>
      {value}
      {suffix}
    </span>
  );
}
