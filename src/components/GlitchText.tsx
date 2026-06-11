"use client";

import type { ElementType } from "react";

type GlitchTextProps = {
  text: string;
  className?: string;
  as?: ElementType;
};

/**
 * Renders text with a chromatic-aberration "glitch" effect.
 * Two duplicate layers (data-text) are offset and clipped via CSS in globals.css.
 */
export function GlitchText({
  text,
  className = "",
  as: Tag = "span",
}: GlitchTextProps) {
  return (
    <Tag className={`glitch ${className}`} data-text={text} aria-label={text}>
      {text}
    </Tag>
  );
}
