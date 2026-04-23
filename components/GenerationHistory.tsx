"use client";

import { useEffect, useRef, useState } from "react";
import type { HistoryEntry } from "@/hooks/useHistory";

interface Props {
  entries: HistoryEntry[];
  onSelect: (content: string) => void;
  onClear: () => void;
}

function HistoryCard({
  entry,
  index,
  onSelect,
}: {
  entry: HistoryEntry;
  index: number;
  onSelect: (c: string) => void;
}) {
  const [expanded, setExpanded] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = cardRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([obs]) => {
        if (obs.isIntersecting) {
          el.classList.add("visible");
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={cardRef}
      className="history-card overflow-hidden"
      style={{
        transitionDelay: `${index * 100}ms`,
        border: "1px solid rgba(204,0,0,0.2)",
        borderRadius: "2px",
      }}
    >
      <button
        className="w-full text-left px-4 py-3 flex items-start justify-between gap-3 transition-colors"
        style={{ background: "#0d0d0d" }}
        onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.background = "#151515")}
        onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.background = "#0d0d0d")}
        onClick={() => setExpanded((v) => !v)}
      >
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1 flex-wrap">
            <span
              className="font-cinzel uppercase"
              style={{ fontSize: "10px", letterSpacing: "0.15em", color: "#cc0000" }}
            >
              {entry.subgenre}
            </span>
            <span style={{ color: "#333" }}>·</span>
            <span
              className="font-cinzel uppercase"
              style={{ fontSize: "10px", letterSpacing: "0.1em", color: "#666666" }}
            >
              {entry.type}
            </span>
            <span style={{ color: "#333" }}>·</span>
            <span
              className="font-cinzel uppercase"
              style={{ fontSize: "10px", letterSpacing: "0.1em", color: "#555555" }}
            >
              {entry.language}
            </span>
          </div>
          <p
            className="font-crimson-text truncate"
            style={{ fontSize: "11px", color: "#888888" }}
          >
            {entry.preview}
          </p>
        </div>
        <span
          className="font-cinzel flex-shrink-0"
          style={{ fontSize: "9px", color: "#555555" }}
        >
          {new Date(entry.createdAt).toLocaleDateString()}
        </span>
      </button>

      {expanded && (
        <div
          className="px-4 py-3"
          style={{ borderTop: "1px solid rgba(204,0,0,0.15)", background: "#0a0a0a" }}
        >
          <pre
            className="font-crimson-text whitespace-pre-wrap leading-relaxed max-h-48 overflow-y-auto"
            style={{ fontSize: "12px", color: "#aaaaaa" }}
          >
            {entry.content}
          </pre>
          <button
            onClick={() => onSelect(entry.content)}
            className="mt-3 font-cinzel uppercase hover:text-white transition-colors"
            style={{ fontSize: "9px", letterSpacing: "0.15em", color: "#cc0000" }}
          >
            ↑ Load into editor
          </button>
        </div>
      )}
    </div>
  );
}

export default function GenerationHistory({ entries, onSelect, onClear }: Props) {
  if (entries.length === 0) return null;

  return (
    <section
      className="mt-3 pt-4"
      style={{ borderTop: "1px solid rgba(204,0,0,0.2)" }}
    >
      <div className="flex items-center justify-between mb-3">
        <span
          className="font-cinzel uppercase"
          style={{ fontSize: "10px", letterSpacing: "0.25em", color: "#ffffff" }}
        >
          Recent Generations ({entries.length}/10)
        </span>
        <button
          onClick={onClear}
          className="font-cinzel uppercase hover:text-white transition-colors"
          style={{ fontSize: "9px", letterSpacing: "0.15em", color: "#555555" }}
        >
          Clear all
        </button>
      </div>

      <div className="space-y-2">
        {entries.map((entry, index) => (
          <HistoryCard key={entry.id} entry={entry} index={index} onSelect={onSelect} />
        ))}
      </div>
    </section>
  );
}
