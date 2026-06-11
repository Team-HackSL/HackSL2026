"use client";

import { useEffect, useRef, useState } from "react";

type Line = { prompt?: string; text: string };

type TypewriterProps = {
  lines: Line[];
  /** ms per character */
  speed?: number;
  /** pause between lines in ms */
  linePause?: number;
  className?: string;
};

/**
 * Types out a sequence of terminal-style lines character by character,
 * leaving a blinking caret on the last line. Honours prefers-reduced-motion
 * by rendering everything instantly.
 */
export function Typewriter({
  lines,
  speed = 38,
  linePause = 450,
  className = "",
}: TypewriterProps) {
  const [rendered, setRendered] = useState<string[]>([]);
  const [done, setDone] = useState(false);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (prefersReducedMotion) {
      setRendered(lines.map((l) => l.text));
      setDone(true);
      return;
    }

    const localTimers = timers.current;
    let lineIdx = 0;
    let charIdx = 0;
    const output: string[] = lines.map(() => "");

    const tick = () => {
      if (lineIdx >= lines.length) {
        setDone(true);
        return;
      }
      const full = lines[lineIdx].text;
      charIdx++;
      output[lineIdx] = full.slice(0, charIdx);
      setRendered([...output]);

      if (charIdx >= full.length) {
        lineIdx++;
        charIdx = 0;
        localTimers.push(setTimeout(tick, linePause));
      } else {
        localTimers.push(setTimeout(tick, speed));
      }
    };

    localTimers.push(setTimeout(tick, 350));

    return () => {
      localTimers.forEach(clearTimeout);
      localTimers.length = 0;
    };
  }, [lines, speed, linePause]);

  return (
    <div className={`font-mono ${className}`}>
      {lines.map((line, i) => {
        const value = rendered[i] ?? "";
        if (!value && !done) return null;
        const isLast = i === lines.length - 1;
        return (
          <div key={i} className="whitespace-pre-wrap break-words">
            {line.prompt && (
              <span className="text-[#00ff66]">{line.prompt} </span>
            )}
            <span>{value}</span>
            {isLast && (
              <span
                className="ml-0.5 inline-block h-[1em] w-[0.6ch] translate-y-[0.12em] bg-[#00ff66] align-middle"
                style={{ animation: "caret-blink 1s step-end infinite" }}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}
