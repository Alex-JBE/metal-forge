"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Language } from "./LanguageSelector";

const GENRES = [
  "Death Metal", "Black Metal", "Doom Metal", "Technical Death", "Melodic Death",
  "Brutal Death", "Atmospheric Black", "Blackened Death", "Funeral Doom", "Sludge Metal",
  "Thrash Metal", "Grindcore", "Deathgrind", "War Metal", "Depressive Black",
  "Symphonic Black", "Post-Metal", "Death-Doom", "Power Metal", "Viking Metal",
  "Folk Metal", "Gothic Metal", "Speed Metal", "Goregrind", "Progressive Metal",
  "Industrial Metal", "Stoner Metal", "Old School Death", "Slam Death", "Drone Metal",
  "Noise Metal", "Mathcore",
];

const CONTENT_TYPES = ["Lyrics", "Intro Monologue", "Outro Text", "Album Story"];
const PROMPT_TYPES = ["Suno", "Udio", "ComfyUI"];

interface Props {
  language: Language;
}

export default function Generator({ language }: Props) {
  const [selectedGenre, setSelectedGenre] = useState("Death Metal");
  const [contentType, setContentType] = useState("Lyrics");
  const [promptType, setPromptType] = useState("Suno");
  const [theme, setTheme] = useState("");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleForge() {
    if (loading) return;
    setLoading(true);
    setResult("");
    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          subgenre: selectedGenre,
          type: "lyrics",
          prompt: theme,
          language,
          contentType,
          promptType,
        }),
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
        setResult(accumulated);
      }
    } catch (err) {
      setResult(err instanceof Error ? err.message : "Generation failed.");
    } finally {
      setLoading(false);
    }
  }

  function pill(active: boolean): React.CSSProperties {
    return {
      padding: "5px 11px",
      border: `1px solid ${active ? "#cc0000" : "#1e1e1e"}`,
      background: active ? "rgba(204,0,0,0.12)" : "#141414",
      color: active ? "#fff" : "#555",
      borderRadius: "100px",
      fontFamily: "var(--font-cinzel), serif",
      fontSize: "8px",
      cursor: "pointer",
      letterSpacing: "0.1em",
      textTransform: "uppercase" as const,
      transition: "all 0.15s",
    };
  }

  const divider: React.CSSProperties = { height: "1px", background: "#333", margin: "18px 0" };

  const sectionLabel: React.CSSProperties = {
    fontFamily: "var(--font-cinzel), serif",
    fontSize: "7px",
    letterSpacing: "0.25em",
    color: "#555",
    textTransform: "uppercase",
    textAlign: "center",
    display: "block",
    marginBottom: "10px",
  };

  return (
    <div style={{ color: "#ccc", maxWidth: "560px", margin: "0 auto", padding: "24px 0" }}>

      {/* Genre pills */}
      <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: "6px" }}>
        {GENRES.map((g) => (
          <button key={g} onClick={() => setSelectedGenre(g)} style={pill(selectedGenre === g)}>
            {g}
          </button>
        ))}
      </div>

      <div style={divider} />

      {/* Content type */}
      <span style={sectionLabel}>Content Type</span>
      <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: "6px" }}>
        {CONTENT_TYPES.map((ct) => (
          <button key={ct} onClick={() => setContentType(ct)} style={pill(contentType === ct)}>
            {ct}
          </button>
        ))}
      </div>

      <div style={divider} />

      {/* Music prompt type */}
      <span style={sectionLabel}>Music Prompt Type</span>
      <div style={{ display: "flex", justifyContent: "center", gap: "6px" }}>
        {PROMPT_TYPES.map((pt) => (
          <button key={pt} onClick={() => setPromptType(pt)} style={pill(promptType === pt)}>
            {pt}
          </button>
        ))}
      </div>

      <div style={divider} />

      {/* Theme input */}
      <div style={{ display: "flex", justifyContent: "center", marginBottom: "16px" }}>
        <input
          type="text"
          value={theme}
          onChange={(e) => setTheme(e.target.value)}
          disabled={loading}
          placeholder="Theme / direction (optional)..."
          style={{
            width: "80%",
            borderRadius: "100px",
            background: "#141414",
            border: "1px solid #252525",
            color: "#bbb",
            padding: "10px 18px",
            fontSize: "12px",
            outline: "none",
            fontFamily: "var(--font-cinzel), serif",
          }}
        />
      </div>

      {/* FORGE button */}
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={handleForge}
        disabled={loading}
        style={{
          width: "100%",
          padding: "14px",
          background: "#cc0000",
          borderRadius: "100px",
          fontFamily: "var(--font-cinzel), serif",
          fontSize: "13px",
          letterSpacing: "0.25em",
          color: "#fff",
          textTransform: "uppercase",
          border: "none",
          cursor: loading ? "not-allowed" : "pointer",
          opacity: loading ? 0.7 : 1,
        }}
      >
        {loading ? "FORGING…" : "FORGE"}
      </motion.button>

      {/* Result */}
      {result && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          style={{
            marginTop: "20px",
            background: "#111",
            border: "1px solid rgba(204,0,0,0.3)",
            borderRadius: "4px",
            padding: "20px 24px",
            fontFamily: "var(--font-crimson-text), Georgia, serif",
            fontSize: "15px",
            lineHeight: "1.85",
            color: "#ccc",
            whiteSpace: "pre-wrap",
          }}
        >
          {result}
        </motion.div>
      )}
    </div>
  );
}
