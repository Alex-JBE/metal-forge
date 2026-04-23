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
        className="text-sm font-medium text-zinc-300 uppercase tracking-widest"
      >
        Subgenre
      </label>
      <select
        id="subgenre"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        className="w-full rounded-md border border-zinc-700 bg-zinc-900 px-3 py-2 text-zinc-100 text-sm focus:outline-none focus:ring-2 focus:ring-red-600 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <option value="" disabled>
          — select a subgenre —
        </option>
        {METAL_SUBGENRES.map((genre) => (
          <option key={genre.value} value={genre.value}>
            {genre.label}
          </option>
        ))}
      </select>
    </div>
  );
}
