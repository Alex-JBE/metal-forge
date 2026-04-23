"use client";

import { useState } from "react";
import Link from "next/link";
import SubgenreSelector from "./SubgenreSelector";
import LanguageSelector, { Language } from "./LanguageSelector";
import GenerationHistory from "./GenerationHistory";
import CopyButton from "./CopyButton";
import { useHistory } from "@/hooks/useHistory";

// ─── Types ───────────────────────────────────────────

const CONTENT_TYPES = [
  { value: "lyrics", label: "Lyrics" },
  { value: "bio", label: "Band Bio" },
  { value: "press_release", label: "Press Release" },
  { value: "concept", label: "Album Concept" },
] as const;

type ContentType = (typeof CONTENT_TYPES)[number]["value"];
type Mode = "text" | "music-prompt";

// ─── Jagged SVG Divider ───────────────────────────────

function JaggedDivider({ fill = "#0a0a0a" }: { fill?: string }) {
  return (
    <svg
      viewBox="0 0 1200 28"
      xmlns="http://www.w3.org/2000/svg"
      className="w-full block"
      preserveAspectRatio="none"
    >
      <polygon
        points="0,0 1200,0 1200,28 1100,8 1000,28 900,8 800,28 700,8 600,28 500,8 400,28 300,8 200,28 100,8 0,28"
        fill={fill}
      />
    </svg>
  );
}

// ─── Skeleton Loader ──────────────────────────────────

function SkeletonLoader() {
  return (
    <div className="space-y-3 py-2" aria-label="Generating…">
      {[100, 85, 92, 70, 88, 60, 95, 75].map((w, i) => (
        <div
          key={i}
          className="skeleton-line h-4"
          style={{ width: `${w}%`, animationDelay: `${i * 0.07}s` }}
        />
      ))}
    </div>
  );
}

// ─── Main Component ───────────────────────────────────

export default function Generator() {
  const [mode, setMode] = useState<Mode>("text");
  const [subgenre, setSubgenre] = useState("");
  const [contentType, setContentType] = useState<ContentType>("lyrics");
  const [language, setLanguage] = useState<Language>("en");
  const [prompt, setPrompt] = useState("");
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [shareUrl, setShareUrl] = useState("");
  const [shareLoading, setShareLoading] = useState(false);
  const [exportLoading, setExportLoading] = useState<"txt" | "pdf" | null>(null);

  const { history, addEntry, clearHistory } = useHistory();

  // ── Generate ──────────────────────────────────────

  async function handleGenerate() {
    if (!subgenre) { setError("Select a subgenre first."); return; }
    setError("");
    setOutput("");
    setShareUrl("");
    setLoading(true);

    try {
      if (mode === "text") {
        await streamText();
      } else {
        await generateMusicPrompt();
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Generation failed.");
    } finally {
      setLoading(false);
    }
  }

  async function streamText() {
    const res = await fetch("/api/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ subgenre, type: contentType, prompt, language }),
    });
    if (!res.ok) {
      const d = await res.json().catch(() => ({}));
      throw new Error(d.error ?? `HTTP ${res.status}`);
    }
    const reader = res.body?.getReader();
    if (!reader) throw new Error("No response body");
    const dec = new TextDecoder();
    let accumulated = "";
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      accumulated += dec.decode(value, { stream: true });
      setOutput(accumulated);
    }
    addEntry({
      subgenre,
      type: contentType,
      language,
      preview: accumulated.slice(0, 100),
      content: accumulated,
    });
  }

  async function generateMusicPrompt() {
    const res = await fetch("/api/music-prompt", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ subgenre, mood: prompt }),
    });
    if (!res.ok) {
      const d = await res.json().catch(() => ({}));
      throw new Error(d.error ?? `HTTP ${res.status}`);
    }
    const data = await res.json();
    setOutput(data.prompt);
    addEntry({
      subgenre,
      type: "music-prompt",
      language: "en",
      preview: data.prompt.slice(0, 100),
      content: data.prompt,
    });
  }

  // ── Export ────────────────────────────────────────

  async function handleExport(format: "txt" | "pdf") {
    if (!output) return;
    setExportLoading(format);
    try {
      const res = await fetch(`/api/export/${format}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: output, subgenre, type: contentType }),
      });
      if (!res.ok) throw new Error(`Export failed (${res.status})`);
      const { url, filename } = await res.json();
      const a = document.createElement("a");
      a.href = url;
      a.download = filename;
      a.click();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Export failed.");
    } finally {
      setExportLoading(null);
    }
  }

  // ── Share ─────────────────────────────────────────

  async function handleShare() {
    if (!output) return;
    setShareLoading(true);
    setShareUrl("");
    try {
      const res = await fetch("/api/share", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: output, subgenre, type: contentType, language }),
      });
      if (!res.ok) throw new Error("Share failed");
      const { url } = await res.json();
      const full = `${window.location.origin}${url}`;
      setShareUrl(full);
      await navigator.clipboard.writeText(full);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Share failed.");
    } finally {
      setShareLoading(false);
    }
  }

  // ── Render ────────────────────────────────────────

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-[#c0c0c0] relative overflow-x-hidden">
      {/* Noise overlay */}
      <div className="noise-overlay" aria-hidden />

      {/* ── Hero ─────────────────────────────────────── */}
      <section className="relative pt-20 pb-10 text-center overflow-hidden">
        <div
          className="absolute inset-0 opacity-20"
          style={{
            background:
              "radial-gradient(ellipse 80% 50% at 50% 0%, #7f0000 0%, transparent 70%)",
          }}
          aria-hidden
        />
        <h1
          className="font-metal-mania glitch text-[clamp(3rem,12vw,7rem)] leading-none text-white uppercase tracking-tight relative z-10"
          data-text="METAL FORGE"
        >
          METAL FORGE
        </h1>
        <p className="mt-4 text-xs uppercase tracking-[0.4em] text-[#c0c0c0]/60 relative z-10">
          AI-Powered Metal Content Generator
        </p>
        <div className="mt-6 flex justify-center gap-4 relative z-10">
          <Link href="/exports" className="text-xs text-zinc-600 hover:text-zinc-400 transition-colors uppercase tracking-widest">
            Exports ↗
          </Link>
        </div>
      </section>

      {/* Jagged top divider */}
      <div className="relative z-10 -mb-1">
        <svg viewBox="0 0 1200 28" xmlns="http://www.w3.org/2000/svg" className="w-full block" preserveAspectRatio="none" aria-hidden>
          <polygon
            points="0,0 1200,0 1200,28 1100,8 1000,28 900,8 800,28 700,8 600,28 500,8 400,28 300,8 200,28 100,8 0,28"
            fill="#111111"
          />
        </svg>
      </div>

      {/* ── Form ──────────────────────────────────────── */}
      <section className="bg-[#111111] py-12 px-6 relative z-10">
        <div className="mx-auto max-w-2xl space-y-6 animate-fade-up">

          {/* Mode toggle */}
          <div className="flex gap-2">
            {(["text", "music-prompt"] as const).map((m) => (
              <button
                key={m}
                onClick={() => { setMode(m); setOutput(""); setShareUrl(""); }}
                disabled={loading}
                className={`flex-1 py-2.5 px-4 rounded-md text-xs font-bold uppercase tracking-widest transition-colors disabled:opacity-50 ${
                  mode === m
                    ? "bg-red-700 text-white"
                    : "bg-[#1a1a1a] text-[#666] hover:bg-[#222] hover:text-[#c0c0c0]"
                }`}
              >
                {m === "text" ? "📜 Text Content" : "🎵 Music Prompt"}
              </button>
            ))}
          </div>

          {/* Language (text mode only) */}
          {mode === "text" && (
            <LanguageSelector value={language} onChange={setLanguage} disabled={loading} />
          )}

          {/* Subgenre */}
          <SubgenreSelector value={subgenre} onChange={setSubgenre} disabled={loading} />

          {/* Content type (text mode only) */}
          {mode === "text" && (
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold uppercase tracking-widest text-[#666]">
                Content Type
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {CONTENT_TYPES.map((ct) => (
                  <button
                    key={ct.value}
                    onClick={() => setContentType(ct.value)}
                    disabled={loading}
                    className={`py-2 px-3 rounded-md text-xs font-semibold uppercase tracking-wider transition-colors disabled:opacity-50 ${
                      contentType === ct.value
                        ? "bg-red-700 text-white"
                        : "bg-[#1a1a1a] text-[#666] hover:bg-[#222] hover:text-[#c0c0c0]"
                    }`}
                  >
                    {ct.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Optional prompt */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold uppercase tracking-widest text-[#666]">
              {mode === "text" ? "Theme / Direction (optional)" : "Mood / Notes (optional)"}
            </label>
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              disabled={loading}
              rows={3}
              placeholder={
                mode === "text"
                  ? "e.g. Norse mythology, apocalyptic despair, war..."
                  : "e.g. cinematic, crushing, atmospheric..."
              }
              className="w-full rounded-md border border-[#2a2a2a] bg-[#1a1a1a] px-4 py-3 text-sm text-[#c0c0c0] placeholder-[#3a3a3a] focus:outline-none focus:ring-1 focus:ring-red-700 focus:border-red-900 transition disabled:opacity-50 resize-none"
            />
          </div>

          {/* Generate button */}
          <button
            onClick={handleGenerate}
            disabled={loading || !subgenre}
            className="forge-btn w-full py-4 rounded-md bg-red-700 hover:bg-red-600 active:bg-red-800 text-white font-metal-mania text-2xl uppercase tracking-widest transition-colors disabled:opacity-40 disabled:cursor-not-allowed disabled:animate-none"
          >
            {loading ? "FORGING…" : "⚡ FORGE"}
          </button>

          {/* Error */}
          {error && (
            <p className="text-red-500 text-xs text-center">{error}</p>
          )}
        </div>
      </section>

      {/* Jagged bottom divider */}
      <div className="relative z-10 -mt-1">
        <svg viewBox="0 0 1200 28" xmlns="http://www.w3.org/2000/svg" className="w-full block rotate-180" preserveAspectRatio="none" aria-hidden>
          <polygon
            points="0,0 1200,0 1200,28 1100,8 1000,28 900,8 800,28 700,8 600,28 500,8 400,28 300,8 200,28 100,8 0,28"
            fill="#111111"
          />
        </svg>
      </div>

      {/* ── Output ────────────────────────────────────── */}
      {(output || loading) && (
        <section className="px-6 py-12 relative z-10">
          <div className="mx-auto max-w-2xl animate-fade-up">
            <div className="rounded-md border border-[#2a2a2a] bg-[#1a1a1a] overflow-hidden">
              {/* Output header */}
              <div className="flex items-center justify-between px-5 py-3 border-b border-[#2a2a2a] bg-[#141414]">
                <span className="text-xs font-bold uppercase tracking-widest text-[#444]">
                  Output
                </span>
                {output && !loading && (
                  <CopyButton
                    text={output}
                    label="Copy"
                    className="text-xs text-[#555] hover:text-[#c0c0c0] transition-colors"
                  />
                )}
              </div>

              {/* Content */}
              <div className="p-5">
                {loading ? (
                  <SkeletonLoader />
                ) : (
                  <pre className="font-share-tech-mono whitespace-pre-wrap text-sm text-[#c0c0c0] leading-relaxed">
                    {output}
                  </pre>
                )}
              </div>

              {/* Action bar */}
              {output && !loading && (
                <div className="flex flex-wrap items-center gap-3 px-5 py-4 border-t border-[#2a2a2a] bg-[#141414]">
                  <button
                    onClick={() => handleExport("txt")}
                    disabled={exportLoading === "txt"}
                    className="text-xs font-semibold text-[#888] hover:text-white transition-colors disabled:opacity-50"
                  >
                    {exportLoading === "txt" ? "Saving…" : "↓ .txt"}
                  </button>
                  <span className="text-[#2a2a2a]">|</span>
                  <button
                    onClick={() => handleExport("pdf")}
                    disabled={exportLoading === "pdf"}
                    className="text-xs font-semibold text-[#888] hover:text-white transition-colors disabled:opacity-50"
                  >
                    {exportLoading === "pdf" ? "Saving…" : "↓ .pdf"}
                  </button>
                  <span className="text-[#2a2a2a]">|</span>
                  <button
                    onClick={handleShare}
                    disabled={shareLoading}
                    className="text-xs font-semibold text-[#888] hover:text-white transition-colors disabled:opacity-50"
                  >
                    {shareLoading ? "Creating link…" : "⤴ Share link"}
                  </button>
                  <Link
                    href="/exports"
                    className="ml-auto text-xs text-[#444] hover:text-[#888] transition-colors"
                  >
                    All exports ↗
                  </Link>
                </div>
              )}

              {/* Share URL display */}
              {shareUrl && (
                <div className="px-5 py-3 border-t border-[#2a2a2a] bg-[#0f0f0f]">
                  <p className="text-xs text-[#555]">
                    Link copied:{" "}
                    <a
                      href={shareUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-red-600 hover:text-red-500 underline transition-colors"
                    >
                      {shareUrl}
                    </a>
                  </p>
                </div>
              )}
            </div>
          </div>
        </section>
      )}

      {/* ── History ───────────────────────────────────── */}
      <section className="px-6 pb-20 relative z-10">
        <div className="mx-auto max-w-2xl">
          <GenerationHistory
            entries={history}
            onSelect={(c) => { setOutput(c); setShareUrl(""); }}
            onClear={clearHistory}
          />
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-[#1a1a1a] py-6 px-6 text-center relative z-10">
        <p className="text-xs text-[#333] uppercase tracking-widest">
          Metal Forge · Powered by Claude
        </p>
      </footer>
    </div>
  );
}
