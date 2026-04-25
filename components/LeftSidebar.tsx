"use client";

import { motion } from "framer-motion";

const GENERATIONS = [
  {
    genre: "Death Metal · Lyrics · EN",
    text: "The funeral homes are backlogged — the earth's been eating well...",
  },
  {
    genre: "Black Metal · Lyrics · DE",
    text: "Im Schatten der ewigen Nacht, wo Stille schreit...",
  },
  {
    genre: "Doom Metal · Intro · EN",
    text: "Before time was named, before light dared...",
  },
  {
    genre: "Thrash Metal · Lyrics · RU",
    text: "Сквозь пепел и ярость, сквозь тьму без конца...",
  },
  {
    genre: "Technical Death · Suno · EN",
    text: "technical death metal, polyrhythmic, 220 BPM, dissonant...",
  },
];

export default function LeftSidebar() {
  return (
    <aside style={{ padding: "12px" }}>
      <p
        style={{
          fontFamily: "var(--font-cinzel), serif",
          fontSize: "7px",
          letterSpacing: "0.2em",
          color: "#cc0000",
          textTransform: "uppercase",
          paddingBottom: "8px",
          marginBottom: "10px",
          borderBottom: "1px solid #1a1a1a",
        }}
      >
        Recent Generations
      </p>

      {GENERATIONS.map((g, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: i * 0.08 }}
          style={{
            background: "#0d0d0d",
            border: "1px solid #1a1a1a",
            padding: "8px",
            marginBottom: "6px",
          }}
        >
          <p
            style={{
              fontFamily: "var(--font-cinzel), serif",
              fontSize: "7px",
              letterSpacing: "0.1em",
              color: "#cc0000",
              textTransform: "uppercase",
              marginBottom: "4px",
            }}
          >
            {g.genre}
          </p>
          <p
            style={{
              fontFamily: "var(--font-crimson-text), Georgia, serif",
              fontStyle: "italic",
              fontSize: "10px",
              color: "#555555",
              lineHeight: "1.5",
              margin: 0,
            }}
          >
            {g.text}
          </p>
        </motion.div>
      ))}
    </aside>
  );
}
