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
        className="font-cinzel uppercase text-[#555]"
        style={{ fontSize: "11px", letterSpacing: "0.2em" }}
      >
        Language
      </label>
      <div className="flex gap-2">
        {LANGUAGES.map((lang) => (
          <button
            key={lang.value}
            onClick={() => onChange(lang.value)}
            disabled={disabled}
            className="flex items-center gap-1.5 px-3 py-2 text-sm font-cinzel transition-colors disabled:opacity-50"
            style={{
              borderRadius: "2px",
              letterSpacing: "0.1em",
              border: value === lang.value ? "1px solid rgba(139,0,0,0.6)" : "1px solid rgba(100,0,0,0.15)",
              background: value === lang.value ? "rgba(139,0,0,0.3)" : "transparent",
              color: value === lang.value ? "#fff" : "#444",
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
