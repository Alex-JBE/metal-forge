"use client";

export const METAL_SUBGENRES = [
  { value: "heavy-metal", label: "Heavy Metal" },
  { value: "thrash-metal", label: "Thrash Metal" },
  { value: "death-metal", label: "Death Metal" },
  { value: "melodic-death-metal", label: "Melodic Death Metal" },
  { value: "black-metal", label: "Black Metal" },
  { value: "doom-metal", label: "Doom Metal" },
  { value: "sludge-metal", label: "Sludge Metal" },
  { value: "power-metal", label: "Power Metal" },
  { value: "progressive-metal", label: "Progressive Metal" },
  { value: "djent", label: "Djent" },
  { value: "metalcore", label: "Metalcore" },
  { value: "deathcore", label: "Deathcore" },
  { value: "groove-metal", label: "Groove Metal" },
  { value: "folk-metal", label: "Folk Metal" },
  { value: "symphonic-metal", label: "Symphonic Metal" },
  { value: "gothic-metal", label: "Gothic Metal" },
  { value: "nu-metal", label: "Nu-Metal" },
  { value: "post-metal", label: "Post-Metal" },
] as const;

export type MetalSubgenre = (typeof METAL_SUBGENRES)[number]["value"];

interface SubgenreSelectorProps {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
}

export default function SubgenreSelector({
  value,
  onChange,
  disabled = false,
}: SubgenreSelectorProps) {
  return (
    <div className="flex flex-col gap-1.5">
      <label
        htmlFor="subgenre"
        className="font-cinzel uppercase"
        style={{ fontSize: "11px", letterSpacing: "0.2em", color: "#aaaaaa" }}
      >
        Subgenre
      </label>
      <select
        id="subgenre"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        className="w-full px-3 py-2.5 text-sm focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed"
        style={{
          background: "#1a1a1a",
          color: "#ffffff",
          border: "1px solid rgba(255,255,255,0.2)",
          borderRadius: "2px",
        }}
      >
        <option value="" disabled style={{ background: "#1a1a1a", color: "#888" }}>
          — select a subgenre —
        </option>
        {METAL_SUBGENRES.map((genre) => (
          <option key={genre.value} value={genre.value} style={{ background: "#1a1a1a", color: "#ffffff" }}>
            {genre.label}
          </option>
        ))}
      </select>
    </div>
  );
}
