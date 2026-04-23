"use client";

import { useState } from "react";
import SubgenreSelector from "./SubgenreSelector";

const CONTENT_TYPES = [
  { value: "lyrics", label: "Lyrics" },
  { value: "bio", label: "Band Bio" },
  { value: "press_release", label: "Press Release" },
  { value: "concept", label: "Album Concept" },
] as const;

type ContentType = (typeof CONTENT_TYPES)[number]["value"];
type Mode = "text" | "music-prompt";

export default function Generator() {
  const [mode, setMode] = useState<Mode>("text");
  const [subgenre, setSubgenre] = useState("");
  const [contentType, setContentType] = useState<ContentType>("lyrics");
  const [prompt, setPrompt] = useState("");
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleGenerate() {
    if (!subgenre) {
      setError("Please select a subgenre.");
      return;
    }
    setError("");
    setOutput("");
    setLoading(true);

    try {
      if (mode === "text") {
        await generateText();
      } else {
        await generateMusicPrompt();
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Generation failed.");
    } finally {
      setLoading(false);
    }
  }

  async function generateText() {
    const res = await fetch("/api/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ subgenre, type: contentType, prompt }),
    });

    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      throw new Error(data.error ?? `HTTP ${res.status}`);
    }

    const reader = res.body?.getReader();
    if (!reader) throw new Error("No response body");

    const decoder = new TextDecoder();
    let accumulated = "";

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      accumulated += decoder.decode(value, { stream: true });
      setOutput(accumulated);
    }
  }

  async function generateMusicPrompt() {
    const res = await fetch("/api/music-prompt", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ subgenre, mood: prompt }),
    });

    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      throw new Error(data.error ?? `HTTP ${res.status}`);
    }

    const data = await res.json();
    setOutput(data.prompt);
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 p-6 md:p-12">
      <header className="mb-10 text-center">
        <h1 className="text-4xl font-black uppercase tracking-tight text-red-600">
          Metal Forge
        </h1>
        <p className="mt-2 text-zinc-400 text-sm tracking-widest uppercase">
          AI-Powered Metal Content Generator
        </p>
      </header>

      <div className="mx-auto max-w-2xl space-y-6">
        {/* Mode toggle */}
        <div className="flex gap-2">
          {(["text", "music-prompt"] as const).map((m) => (
            <button
              key={m}
              onClick={() => { setMode(m); setOutput(""); }}
              className={`flex-1 py-2 px-4 rounded-md text-sm font-semibold uppercase tracking-wider transition-colors ${
                mode === m
                  ? "bg-red-700 text-white"
                  : "bg-zinc-800 text-zinc-400 hover:bg-zinc-700"
              }`}
            >
              {m === "text" ? "Text Content" : "Music Prompt"}
            </button>
          ))}
        </div>

        {/* Subgenre */}
        <SubgenreSelector value={subgenre} onChange={setSubgenre} disabled={loading} />

        {/* Content type — only for text mode */}
        {mode === "text" && (
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-zinc-300 uppercase tracking-widest">
              Content Type
            </label>
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
              {CONTENT_TYPES.map((ct) => (
                <button
                  key={ct.value}
                  onClick={() => setContentType(ct.value)}
                  disabled={loading}
                  className={`py-2 px-3 rounded-md text-xs font-semibold uppercase tracking-wider transition-colors disabled:opacity-50 ${
                    contentType === ct.value
                      ? "bg-red-700 text-white"
                      : "bg-zinc-800 text-zinc-400 hover:bg-zinc-700"
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
          <label className="text-sm font-medium text-zinc-300 uppercase tracking-widest">
            {mode === "text" ? "Theme / Direction (optional)" : "Mood / Notes (optional)"}
          </label>
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            disabled={loading}
            rows={3}
            placeholder={
              mode === "text"
                ? "E.g. War, Norse mythology, existential dread..."
                : "E.g. cinematic, crushing, atmospheric..."
            }
            className="w-full rounded-md border border-zinc-700 bg-zinc-900 px-3 py-2 text-zinc-100 text-sm placeholder-zinc-600 focus:outline-none focus:ring-2 focus:ring-red-600 focus:border-transparent disabled:opacity-50 resize-none"
          />
        </div>

        {/* Generate button */}
        <button
          onClick={handleGenerate}
          disabled={loading || !subgenre}
          className="w-full py-3 rounded-md bg-red-700 hover:bg-red-600 text-white font-black uppercase tracking-widest text-sm transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
        >
          {loading ? "Forging..." : "Forge"}
        </button>

        {/* Error */}
        {error && (
          <p className="text-red-400 text-sm text-center">{error}</p>
        )}

        {/* Output */}
        {output && (
          <div className="rounded-md border border-zinc-700 bg-zinc-900 p-4">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs uppercase tracking-widest text-zinc-500 font-semibold">
                Output
              </span>
              <button
                onClick={() => navigator.clipboard.writeText(output)}
                className="text-xs text-zinc-400 hover:text-zinc-100 transition-colors"
              >
                Copy
              </button>
            </div>
            <pre className="whitespace-pre-wrap text-sm text-zinc-200 font-mono leading-relaxed">
              {output}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
}
