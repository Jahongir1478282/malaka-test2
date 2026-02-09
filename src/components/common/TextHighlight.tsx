/** @format */

// ============================================
// TEXT HIGHLIGHT COMPONENT
// ============================================

import { escapeRegExp } from "../../utils/helpers";

interface TextHighlightProps {
  text: string;
  query: string;
}

export function TextHighlight({ text, query }: TextHighlightProps) {
  const trimmedQuery = query.trim();

  if (!trimmedQuery) {
    return <span>{text}</span>;
  }

  const escaped = escapeRegExp(trimmedQuery);
  const parts = text.split(new RegExp(`(${escaped})`, "gi"));
  const target = trimmedQuery.toLowerCase();

  return (
    <span>
      {parts.map((part, index) => {
        const isMatch = part.toLowerCase() === target;
        return isMatch ? (
          <mark
            key={`match-${index}`}
            className="rounded-sm bg-yellow-200 px-0.5 text-yellow-900"
          >
            {part}
          </mark>
        ) : (
          <span key={`text-${index}`}>{part}</span>
        );
      })}
    </span>
  );
}
