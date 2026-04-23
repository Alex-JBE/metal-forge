"use client";

export const LANGUAGES = [
  { value: "en", label: "EN", flag: "🇬🇧" },
  { value: "de", label: "DE", flag: "🇩🇪" },
  { value: "ru", label: "RU", flag: "🇷🇺" },
] as const;

export type Language = (typeof LANGUAGES)[number]["value"];

interface Props {
  value: Language;
  onChange: (value: Language) => void;
  disabled?: boolean;
}

export default function LanguageSelector({ value, onChange, disabled }: Props) {
  return (
    <div className="flex flex-col gap-1.5">
      <label
        className="font-cinzel uppercase"
        style={{ fontSize: "11px", letterSpacing: "0.2em", color: "#aaaaaa" }}
      >
        Language
      </label>
      <div className="flex gap-2">
        {LANGUAGES.map((lang) => (
          <button
            key={lang.value}
            onClick={() => onChange(lang.value)}
            disabled={disabled}
            className="flex items-center gap-1.5 px-3 py-2 font-cinzel transition-colors disabled:opacity-50"
            style={{
              fontSize: "11px",
              borderRadius: "2px",
              letterSpacing: "0.1em",
              border: value === lang.value ? "1px solid rgba(204,0,0,0.7)" : "1px solid rgba(255,255,255,0.15)",
              background: value === lang.value ? "rgba(204,0,0,0.25)" : "transparent",
              color: value === lang.value ? "#ffffff" : "#666666",
            }}
          >
            <span>{lang.flag}</span>
            <span>{lang.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
