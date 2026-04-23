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
      <label className="text-sm font-medium text-zinc-300 uppercase tracking-widest">
        Language
      </label>
      <div className="flex gap-2">
        {LANGUAGES.map((lang) => (
          <button
            key={lang.value}
            onClick={() => onChange(lang.value)}
            disabled={disabled}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-md text-sm font-semibold transition-colors disabled:opacity-50 ${
              value === lang.value
                ? "bg-red-700 text-white"
                : "bg-zinc-800 text-zinc-400 hover:bg-zinc-700"
            }`}
          >
            <span>{lang.flag}</span>
            <span>{lang.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
