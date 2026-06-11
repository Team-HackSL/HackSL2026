import { Fragment, type ReactNode } from "react";

/**
 * Renders inline **bold** markers within a line of text. Everything else is
 * treated as plain text, so author-provided content is never injected as HTML.
 */
function renderInline(text: string): ReactNode[] {
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return parts
    .filter((part) => part.length > 0)
    .map((part, i) => {
      if (part.startsWith("**") && part.endsWith("**")) {
        return (
          <strong key={i} className="font-semibold text-[var(--foreground)]">
            {part.slice(2, -2)}
          </strong>
        );
      }
      return <Fragment key={i}>{part}</Fragment>;
    });
}

type Block =
  | { type: "h2" | "h3" | "p" | "quote"; text: string }
  | { type: "ul" | "ol"; items: string[] };

/** Splits raw markdown text into a flat list of renderable blocks. */
function parseBlocks(markdown: string): Block[] {
  const lines = markdown.replace(/\r\n/g, "\n").split("\n");
  const blocks: Block[] = [];
  let paragraph: string[] = [];

  const flushParagraph = () => {
    if (paragraph.length > 0) {
      blocks.push({ type: "p", text: paragraph.join(" ") });
      paragraph = [];
    }
  };

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();

    if (line === "") {
      flushParagraph();
      continue;
    }

    if (line.startsWith("### ")) {
      flushParagraph();
      blocks.push({ type: "h3", text: line.slice(4) });
      continue;
    }
    if (line.startsWith("## ")) {
      flushParagraph();
      blocks.push({ type: "h2", text: line.slice(3) });
      continue;
    }
    if (line.startsWith("> ")) {
      flushParagraph();
      blocks.push({ type: "quote", text: line.slice(2) });
      continue;
    }
    if (/^[-*]\s+/.test(line)) {
      flushParagraph();
      const items: string[] = [];
      while (i < lines.length && /^[-*]\s+/.test(lines[i].trim())) {
        items.push(lines[i].trim().replace(/^[-*]\s+/, ""));
        i++;
      }
      i--;
      blocks.push({ type: "ul", items });
      continue;
    }
    if (/^\d+\.\s+/.test(line)) {
      flushParagraph();
      const items: string[] = [];
      while (i < lines.length && /^\d+\.\s+/.test(lines[i].trim())) {
        items.push(lines[i].trim().replace(/^\d+\.\s+/, ""));
        i++;
      }
      i--;
      blocks.push({ type: "ol", items });
      continue;
    }

    paragraph.push(line);
  }
  flushParagraph();

  return blocks;
}

/** Renders a small, safe subset of Markdown used by blog posts. */
export function Markdown({ content }: { content: string }) {
  const blocks = parseBlocks(content);

  return (
    <div className="space-y-5">
      {blocks.map((block, i) => {
        switch (block.type) {
          case "h2":
            return (
              <h2
                key={i}
                className="mt-10 text-2xl font-bold tracking-[-0.02em] text-[var(--foreground)]"
              >
                {renderInline(block.text)}
              </h2>
            );
          case "h3":
            return (
              <h3
                key={i}
                className="mt-8 text-xl font-semibold tracking-[-0.01em] text-[var(--foreground)]"
              >
                {renderInline(block.text)}
              </h3>
            );
          case "quote":
            return (
              <blockquote
                key={i}
                className="border-l-4 border-[var(--accent)] bg-[var(--surface)] py-3 pl-5 pr-4 text-lg font-medium italic text-[var(--foreground)]"
              >
                {renderInline(block.text)}
              </blockquote>
            );
          case "ul":
            return (
              <ul
                key={i}
                className="list-disc space-y-2 pl-6 text-[var(--muted)]"
              >
                {block.items.map((item, j) => (
                  <li key={j}>{renderInline(item)}</li>
                ))}
              </ul>
            );
          case "ol":
            return (
              <ol
                key={i}
                className="list-decimal space-y-2 pl-6 text-[var(--muted)]"
              >
                {block.items.map((item, j) => (
                  <li key={j}>{renderInline(item)}</li>
                ))}
              </ol>
            );
          default:
            return (
              <p key={i} className="leading-relaxed text-[var(--muted)]">
                {renderInline(block.text)}
              </p>
            );
        }
      })}
    </div>
  );
}
