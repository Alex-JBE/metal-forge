"use client";

import { useState, useEffect } from "react";
import { Language } from "./LanguageSelector";

const SLIDES = [
  "https://images.pexels.com/photos/1540406/pexels-photo-1540406.jpeg?w=1920",
  "https://images.pexels.com/photos/1763075/pexels-photo-1763075.jpeg?w=1920",
  "https://images.pexels.com/photos/995301/pexels-photo-995301.jpeg?w=1920",
  "https://images.pexels.com/photos/460537/pexels-photo-460537.jpeg?w=1920",
  "https://images.pexels.com/photos/1105666/pexels-photo-1105666.jpeg?w=1920",
];

const LANGS = [
  { value: "en" as Language, flag: "🇬🇧", label: "EN" },
  { value: "de" as Language, flag: "🇩🇪", label: "DE" },
  { value: "ru" as Language, flag: "🇷🇺", label: "RU" },
];

interface Props {
  language: Language;
  onLanguageChange: (lang: Language) => void;
}

export default function SiteHeader({ language, onLanguageChange }: Props) {
  const [active, setActive] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setActive((prev) => (prev + 1) % SLIDES.length);
    }, 5000);
    return () => clearInterval(id);
  }, []);

  return (
    <header style={{ height: "280px", position: "relative", overflow: "hidden" }}>
      {/* Carousel */}
      {SLIDES.map((src, i) => (
        <div
          key={src}
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage: `url(${src})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            opacity: i === active ? 1 : 0,
            transition: "opacity 1.5s ease-in-out",
          }}
        >
          <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.72)" }} />
        </div>
      ))}

      {/* Logo centered */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <h1
          style={{
            fontFamily: "var(--font-metal-mania), serif",
            fontSize: "72px",
            color: "#fff",
            textShadow: "0 0 50px rgba(200,0,0,0.8), 3px 3px 0 #550000",
            lineHeight: "1",
            margin: 0,
          }}
        >
          METAL FORGE
        </h1>
        <p
          style={{
            fontFamily: "var(--font-cinzel), serif",
            fontSize: "9px",
            letterSpacing: "0.3em",
            color: "rgba(255,255,255,0.35)",
            marginTop: "8px",
            textTransform: "uppercase",
          }}
        >
          AI-POWERED METAL CONTENT GENERATOR
        </p>
      </div>

      {/* Nav dots */}
      <div
        style={{
          position: "absolute",
          bottom: "12px",
          left: 0,
          right: 0,
          display: "flex",
          justifyContent: "center",
          gap: "8px",
        }}
      >
        {SLIDES.map((_, i) => (
          <button
            key={i}
            onClick={() => setActive(i)}
            style={{
              width: "8px",
              height: "8px",
              borderRadius: "50%",
              border: "none",
              cursor: "pointer",
              background: i === active ? "#cc0000" : "rgba(255,255,255,0.2)",
              transition: "background 0.3s",
              padding: 0,
            }}
          />
        ))}
      </div>

      {/* Language selector */}
      <div
        style={{
          position: "absolute",
          top: "16px",
          right: "16px",
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-end",
          gap: "6px",
        }}
      >
        <span
          style={{
            fontFamily: "var(--font-cinzel), serif",
            fontSize: "7px",
            letterSpacing: "0.15em",
            color: "rgba(255,255,255,0.3)",
            textTransform: "uppercase",
          }}
        >
          LYRICS LANGUAGE
        </span>
        <div style={{ display: "flex", gap: "6px" }}>
          {LANGS.map((lang) => (
            <button
              key={lang.value}
              onClick={() => onLanguageChange(lang.value)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "4px",
                padding: "4px 10px",
                border: language === lang.value ? "1px solid #cc0000" : "1px solid rgba(255,255,255,0.15)",
                background: language === lang.value ? "rgba(204,0,0,0.25)" : "rgba(0,0,0,0.5)",
                borderRadius: "100px",
                fontFamily: "var(--font-cinzel), serif",
                fontSize: "9px",
                color: language === lang.value ? "#fff" : "rgba(255,255,255,0.5)",
                cursor: "pointer",
              }}
            >
              <span>{lang.flag}</span>
              <span>{lang.label}</span>
            </button>
          ))}
        </div>
      </div>
    </header>
  );
}
