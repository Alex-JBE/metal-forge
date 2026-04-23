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
        border: "1px solid rgba(100,0,0,0.15)",
        borderRadius: "2px",
      }}
    >
      <button
        className="w-full text-left px-4 py-3 flex items-start justify-between gap-3 transition-colors"
        style={{ background: "rgba(8,8,8,0.6)" }}
        onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.background = "rgba(20,0,0,0.4)")}
        onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.background = "rgba(8,8,8,0.6)")}
        onClick={() => setExpanded((v) => !v)}
      >
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1 flex-wrap">
            <span
              className="font-cinzel uppercase text-red-900"
              style={{ fontSize: "10px", letterSpacing: "0.15em" }}
            >
              {entry.subgenre}
            </span>
            <span className="text-[#2a2a2a]">·</span>
            <span
              className="font-cinzel uppercase text-[#333]"
              style={{ fontSize: "10px", letterSpacing: "0.1em" }}
            >
              {entry.type}
            </span>
            <span className="text-[#2a2a2a]">·</span>
            <span
              className="font-cinzel uppercase text-[#2a2a2a]"
              style={{ fontSize: "10px", letterSpacing: "0.1em" }}
            >
              {entry.language}
            </span>
          </div>
          <p className="font-crimson-text text-xs text-[#333] truncate">{entry.preview}</p>
        </div>
        <span className="font-cinzel text-[#2a2a2a] flex-shrink-0" style={{ fontSize: "10px" }}>
          {new Date(entry.createdAt).toLocaleDateString()}
        </span>
      </button>

      {expanded && (
        <div
          className="px-4 py-3"
          style={{ borderTop: "1px solid rgba(100,0,0,0.1)", background: "rgba(4,4,4,0.8)" }}
        >
          <pre className="font-crimson-text whitespace-pre-wrap text-xs text-[#555] leading-relaxed max-h-48 overflow-y-auto">
            {entry.content}
          </pre>
          <button
            onClick={() => onSelect(entry.content)}
            className="mt-3 font-cinzel text-red-900 hover:text-red-700 transition-colors uppercase"
            style={{ fontSize: "10px", letterSpacing: "0.15em" }}
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
    <section className="mt-10 pt-8" style={{ borderTop: "1px solid rgba(100,0,0,0.1)" }}>
      <div className="flex items-center justify-between mb-4">
        <span
          className="font-cinzel uppercase text-[#333]"
          style={{ fontSize: "10px", letterSpacing: "0.25em" }}
        >
          Recent Generations ({entries.length}/10)
        </span>
        <button
          onClick={onClear}
          className="font-cinzel uppercase text-[#2a2a2a] hover:text-[#555] transition-colors"
          style={{ fontSize: "10px", letterSpacing: "0.15em" }}
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
