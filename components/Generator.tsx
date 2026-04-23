"use client";

import { useRef, useState } from "react";
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

// ─── Glass Card style ─────────────────────────────────

const GLASS: React.CSSProperties = {
  background: "rgba(8,8,8,0.92)",
  border: "1px solid rgba(100,0,0,0.25)",
  backdropFilter: "blur(10px)",
  WebkitBackdropFilter: "blur(10px)",
  borderRadius: "2px",
};

// ─── Label ────────────────────────────────────────────

function Label({ children }: { children: React.ReactNode }) {
  return (
    <span
      className="font-cinzel uppercase block mb-1.5"
      style={{ fontSize: "11px", letterSpacing: "0.2em", color: "rgba(255,255,255,0.4)" }}
    >
      {children}
    </span>
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
  const [revealKey, setRevealKey] = useState(0);

  const forgeBtnRef = useRef<HTMLButtonElement>(null);
  const { history, addEntry, clearHistory } = useHistory();

  // ── Forge flash ───────────────────────────────────

  function triggerForgeFlash() {
    const btn = forgeBtnRef.current;
    if (!btn) return;
    btn.classList.remove("forge-flash");
    void btn.offsetWidth;
    btn.classList.add("forge-flash");
    setTimeout(() => btn.classList.remove("forge-flash"), 450);
  }

  // ── Generate ──────────────────────────────────────

  async function handleGenerate() {
    if (!subgenre) { setError("Select a subgenre first."); return; }
    triggerForgeFlash();
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
    setRevealKey((k) => k + 1);
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
    setRevealKey((k) => k + 1);
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

  // ── Output font ───────────────────────────────────

  const outputClass =
    mode === "music-prompt"
      ? "font-share-tech-mono text-[13px] leading-relaxed"
      : "font-crimson-text text-[16px] leading-[1.9]";

  // ── Render ────────────────────────────────────────

  return (
    <div className="text-[#cccccc]">
      {/* ── Form card ─────────────────────────────────── */}
      <div style={{ marginBottom: "12px" }}>
        <div style={{ ...GLASS, padding: "24px" }}>
          <div className="space-y-5">

            {/* Mode toggle */}
            <div className="flex gap-2">
              {(["text", "music-prompt"] as const).map((m) => (
                <button
                  key={m}
                  onClick={() => { setMode(m); setOutput(""); setShareUrl(""); }}
                  disabled={loading}
                  className="flex-1 py-2 px-3 font-cinzel uppercase transition-colors disabled:opacity-50"
                  style={{
                    fontSize: "9px",
                    letterSpacing: "0.15em",
                    borderRadius: "2px",
                    border: mode === m ? "1px solid rgba(204,0,0,0.6)" : "1px solid rgba(100,0,0,0.15)",
                    background: mode === m ? "rgba(204,0,0,0.2)" : "transparent",
                    color: mode === m ? "#fff" : "rgba(255,255,255,0.35)",
                  }}
                >
                  {m === "text" ? "Text Content" : "Music Prompt"}
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
              <div>
                <Label>Content Type</Label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {CONTENT_TYPES.map((ct) => (
                    <button
                      key={ct.value}
                      onClick={() => setContentType(ct.value)}
                      disabled={loading}
                      className="py-1.5 px-2 font-cinzel uppercase transition-colors disabled:opacity-50"
                      style={{
                        fontSize: "8px",
                        letterSpacing: "0.1em",
                        borderRadius: "2px",
                        border: contentType === ct.value ? "1px solid rgba(204,0,0,0.6)" : "1px solid rgba(100,0,0,0.15)",
                        background: contentType === ct.value ? "rgba(204,0,0,0.2)" : "transparent",
                        color: contentType === ct.value ? "#fff" : "rgba(255,255,255,0.35)",
                      }}
                    >
                      {ct.label}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Optional prompt */}
            <div>
              <Label>
                {mode === "text" ? "Theme / Direction (optional)" : "Mood / Notes (optional)"}
              </Label>
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
                className="w-full px-3 py-2.5 text-sm text-[#cccccc] placeholder-[#2a2a2a] bg-transparent focus:outline-none disabled:opacity-50 resize-none"
                style={{
                  border: "1px solid rgba(100,0,0,0.2)",
                  borderRadius: "2px",
                  transition: "border-color 0.2s",
                  fontSize: "12px",
                }}
                onFocus={(e) => (e.target.style.borderColor = "rgba(204,0,0,0.5)")}
                onBlur={(e) => (e.target.style.borderColor = "rgba(100,0,0,0.2)")}
              />
            </div>

            {/* Generate button */}
            <button
              ref={forgeBtnRef}
              onClick={handleGenerate}
              disabled={loading || !subgenre}
              className="forge-btn w-full py-3 font-metal-mania text-white uppercase tracking-widest transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
              style={{
                fontSize: "16px",
                borderRadius: "2px",
                background: loading ? "#8a0000" : "#cc0000",
                letterSpacing: "0.2em",
              }}
              onMouseEnter={(e) => { if (!loading && subgenre) (e.currentTarget as HTMLElement).style.background = "#e00000"; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = loading ? "#8a0000" : "#cc0000"; }}
            >
              {loading ? "FORGING…" : "FORGE"}
            </button>

            {/* Error */}
            {error && (
              <p className="font-cinzel text-[#cc0000] text-center" style={{ fontSize: "10px", letterSpacing: "0.1em" }}>
                {error}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* ── Output card ───────────────────────────────── */}
      {(output || loading) && (
        <div style={{ marginBottom: "12px", overflow: "hidden", ...GLASS }}>
          {/* Header */}
          <div
            className="flex items-center justify-between px-5 py-2.5"
            style={{ borderBottom: "1px solid rgba(100,0,0,0.15)" }}
          >
            <span
              className="font-cinzel uppercase text-[#333]"
              style={{ fontSize: "9px", letterSpacing: "0.25em" }}
            >
              Output
            </span>
            {output && !loading && (
              <CopyButton
                text={output}
                label="Copy"
                className="font-cinzel text-[#444] hover:text-[#888] transition-colors text-[9px] tracking-[0.15em] uppercase"
              />
            )}
          </div>

          {/* Content */}
          <div className="p-5">
            {loading ? (
              <SkeletonLoader />
            ) : (
              <div key={revealKey} className={outputClass}>
                {output.split("\n").map((line, i) => (
                  <span
                    key={i}
                    className="line-reveal block"
                    style={{
                      animationDelay: `${i * 50}ms`,
                      minHeight: line ? undefined : "1.4em",
                    }}
                  >
                    {line}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Action bar */}
          {output && !loading && (
            <div
              className="flex flex-wrap items-center gap-3 px-5 py-3"
              style={{ borderTop: "1px solid rgba(100,0,0,0.15)" }}
            >
              <button
                onClick={() => handleExport("txt")}
                disabled={exportLoading === "txt"}
                className="font-cinzel text-[#555] hover:text-[#999] transition-colors disabled:opacity-50 uppercase"
                style={{ fontSize: "9px", letterSpacing: "0.15em" }}
              >
                {exportLoading === "txt" ? "SAVING…" : "↓ .TXT"}
              </button>
              <span className="text-[#1a1a1a]">|</span>
              <button
                onClick={() => handleExport("pdf")}
                disabled={exportLoading === "pdf"}
                className="font-cinzel text-[#555] hover:text-[#999] transition-colors disabled:opacity-50 uppercase"
                style={{ fontSize: "9px", letterSpacing: "0.15em" }}
              >
                {exportLoading === "pdf" ? "SAVING…" : "↓ .PDF"}
              </button>
              <span className="text-[#1a1a1a]">|</span>
              <button
                onClick={handleShare}
                disabled={shareLoading}
                className="font-cinzel text-[#555] hover:text-[#999] transition-colors disabled:opacity-50 uppercase"
                style={{ fontSize: "9px", letterSpacing: "0.15em" }}
              >
                {shareLoading ? "CREATING…" : "↑ SHARE"}
              </button>
              <Link
                href="/exports"
                className="ml-auto font-cinzel text-[#333] hover:text-[#666] transition-colors uppercase"
                style={{ fontSize: "9px", letterSpacing: "0.15em" }}
              >
                ALL EXPORTS ↗
              </Link>
            </div>
          )}

          {/* Share URL */}
          {shareUrl && (
            <div
              className="px-5 py-2.5"
              style={{ borderTop: "1px solid rgba(100,0,0,0.15)", background: "rgba(0,0,0,0.3)" }}
            >
              <p className="font-cinzel text-[#444]" style={{ fontSize: "9px", letterSpacing: "0.1em" }}>
                LINK COPIED:{" "}
                <a
                  href={shareUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-red-800 hover:text-red-600 underline transition-colors"
                >
                  {shareUrl}
                </a>
              </p>
            </div>
          )}
        </div>
      )}

      {/* ── History ───────────────────────────────────── */}
      <GenerationHistory
        entries={history}
        onSelect={(c) => {
          setOutput(c);
          setRevealKey((k) => k + 1);
          setShareUrl("");
        }}
        onClear={clearHistory}
      />
    </div>
  );
}
