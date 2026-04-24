"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import SubgenreSelector from "./SubgenreSelector";
import { Language } from "./LanguageSelector";
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

// ─── Card style ───────────────────────────────────────

const CARD: React.CSSProperties = {
  background: "#111111",
  border: "1px solid rgba(204,0,0,0.3)",
  borderRadius: "2px",
};

// ─── Label ────────────────────────────────────────────

function Label({ children }: { children: React.ReactNode }) {
  return (
    <span
      className="font-cinzel uppercase block mb-1.5"
      style={{ fontSize: "11px", letterSpacing: "0.2em", color: "#aaaaaa" }}
    >
      {children}
    </span>
  );
}

// ─── Main Component ───────────────────────────────────

interface Props {
  language: Language;
}

export default function Generator({ language }: Props) {
  const [mode, setMode] = useState<Mode>("text");
  const [subgenre, setSubgenre] = useState("");
  const [contentType, setContentType] = useState<ContentType>("lyrics");
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
    <div style={{ color: "#cccccc", maxWidth: "560px", margin: "0 auto" }}>

      {/* ── Form card ─────────────────────────────────── */}
      <div style={{ ...CARD, padding: "24px", marginBottom: "12px" }}>
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
                  border: mode === m ? "1px solid rgba(204,0,0,0.7)" : "1px solid rgba(255,255,255,0.15)",
                  background: mode === m ? "rgba(204,0,0,0.25)" : "transparent",
                  color: mode === m ? "#ffffff" : "#666666",
                }}
              >
                {m === "text" ? "Text Content" : "Music Prompt"}
              </button>
            ))}
          </div>

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
                      border: contentType === ct.value ? "1px solid rgba(204,0,0,0.7)" : "1px solid rgba(255,255,255,0.15)",
                      background: contentType === ct.value ? "rgba(204,0,0,0.25)" : "transparent",
                      color: contentType === ct.value ? "#ffffff" : "#777777",
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
              className="w-full px-3 py-2.5 text-sm placeholder-[#444] focus:outline-none disabled:opacity-50 resize-none"
              style={{
                background: "#1a1a1a",
                color: "#cccccc",
                border: "1px solid rgba(255,255,255,0.15)",
                borderRadius: "2px",
                fontSize: "12px",
                transition: "border-color 0.2s",
              }}
              onFocus={(e) => (e.target.style.borderColor = "rgba(204,0,0,0.6)")}
              onBlur={(e) => (e.target.style.borderColor = "rgba(255,255,255,0.15)")}
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
            onMouseEnter={(e) => { if (!loading && subgenre) (e.currentTarget as HTMLElement).style.background = "#e60000"; }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = loading ? "#8a0000" : "#cc0000"; }}
          >
            {loading ? "FORGING…" : "FORGE"}
          </button>

          {/* Error */}
          {error && (
            <p className="font-cinzel text-center" style={{ color: "#cc0000", fontSize: "10px", letterSpacing: "0.1em" }}>
              {error}
            </p>
          )}
        </div>
      </div>

      {/* ── Output card ───────────────────────────────── */}
      {(output || loading) && (
        <div style={{ ...CARD, marginBottom: "12px", overflow: "hidden" }}>
          {/* Header */}
          <div
            className="flex items-center justify-between px-5 py-2.5"
            style={{ borderBottom: "1px solid rgba(204,0,0,0.2)" }}
          >
            <span
              className="font-cinzel uppercase"
              style={{ fontSize: "9px", letterSpacing: "0.25em", color: "#666666" }}
            >
              Output
            </span>
            {output && !loading && (
              <CopyButton
                text={output}
                label="Copy"
                className="font-cinzel uppercase hover:text-white transition-colors text-[9px] tracking-[0.15em] text-[#666]"
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
              style={{ borderTop: "1px solid rgba(204,0,0,0.2)" }}
            >
              <button
                onClick={() => handleExport("txt")}
                disabled={exportLoading === "txt"}
                className="font-cinzel uppercase hover:text-white transition-colors disabled:opacity-50"
                style={{ fontSize: "9px", letterSpacing: "0.15em", color: "#666" }}
              >
                {exportLoading === "txt" ? "SAVING…" : "↓ .TXT"}
              </button>
              <span style={{ color: "#333" }}>|</span>
              <button
                onClick={() => handleExport("pdf")}
                disabled={exportLoading === "pdf"}
                className="font-cinzel uppercase hover:text-white transition-colors disabled:opacity-50"
                style={{ fontSize: "9px", letterSpacing: "0.15em", color: "#666" }}
              >
                {exportLoading === "pdf" ? "SAVING…" : "↓ .PDF"}
              </button>
              <span style={{ color: "#333" }}>|</span>
              <button
                onClick={handleShare}
                disabled={shareLoading}
                className="font-cinzel uppercase hover:text-white transition-colors disabled:opacity-50"
                style={{ fontSize: "9px", letterSpacing: "0.15em", color: "#666" }}
              >
                {shareLoading ? "CREATING…" : "↑ SHARE"}
              </button>
              <Link
                href="/exports"
                className="ml-auto font-cinzel uppercase hover:text-white transition-colors"
                style={{ fontSize: "9px", letterSpacing: "0.15em", color: "#444" }}
              >
                ALL EXPORTS ↗
              </Link>
            </div>
          )}

          {/* Share URL */}
          {shareUrl && (
            <div
              className="px-5 py-2.5"
              style={{ borderTop: "1px solid rgba(204,0,0,0.2)", background: "rgba(0,0,0,0.3)" }}
            >
              <p className="font-cinzel" style={{ fontSize: "9px", letterSpacing: "0.1em", color: "#666" }}>
                LINK COPIED:{" "}
                <a
                  href={shareUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-red-500 underline transition-colors"
                  style={{ color: "#cc0000" }}
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
