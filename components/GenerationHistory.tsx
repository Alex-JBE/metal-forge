"use client";

import { useState } from "react";
import type { HistoryEntry } from "@/hooks/useHistory";

interface Props {
  entries: HistoryEntry[];
  onSelect: (content: string) => void;
  onClear: () => void;
}

export default function GenerationHistory({ entries, onSelect, onClear }: Props) {
  const [expanded, setExpanded] = useState<string | null>(null);

  if (entries.length === 0) return null;

  return (
    <section className="mt-10 border-t border-zinc-800 pt-8">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xs font-bold uppercase tracking-widest text-zinc-500">
          Recent Generations ({entries.length}/10)
        </h2>
        <button
          onClick={onClear}
          className="text-xs text-zinc-700 hover:text-zinc-400 transition-colors"
        >
          Clear all
        </button>
      </div>

      <div className="space-y-2">
        {entries.map((entry) => (
          <div
            key={entry.id}
            className="rounded-md border border-zinc-800 bg-zinc-900/40 overflow-hidden"
          >
            <button
              className="w-full text-left px-4 py-3 flex items-start justify-between gap-3 hover:bg-zinc-800/30 transition-colors"
              onClick={() => setExpanded(expanded === entry.id ? null : entry.id)}
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1 flex-wrap">
                  <span className="text-xs font-bold uppercase text-red-600 tracking-wide">
                    {entry.subgenre}
                  </span>
                  <span className="text-zinc-700">·</span>
                  <span className="text-xs text-zinc-500 uppercase">{entry.type}</span>
                  <span className="text-zinc-700">·</span>
                  <span className="text-xs text-zinc-600 uppercase">{entry.language}</span>
                </div>
                <p className="text-xs text-zinc-600 truncate">{entry.preview}</p>
              </div>
              <span className="text-xs text-zinc-700 flex-shrink-0">
                {new Date(entry.createdAt).toLocaleDateString()}
              </span>
            </button>

            {expanded === entry.id && (
              <div className="border-t border-zinc-800 px-4 py-3">
                <pre className="whitespace-pre-wrap text-xs text-zinc-400 font-mono leading-relaxed max-h-48 overflow-y-auto">
                  {entry.content}
                </pre>
                <button
                  onClick={() => onSelect(entry.content)}
                  className="mt-3 text-xs text-red-600 hover:text-red-500 transition-colors font-semibold"
                >
                  ↑ Load into editor
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
