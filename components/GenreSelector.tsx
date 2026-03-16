"use client";

import { GENRES } from "@/lib/constants";
import type { GenreOption } from "@/types/movie";

interface GenreSelectorProps {
  selectedSlug: string | null;
  onSelect: (genre: GenreOption | null) => void;
  disabled?: boolean;
}

const GENRE_ICONS: Record<string, string> = {
  action: "💥",
  comedy: "😂",
  drama: "🎭",
  horror: "👻",
  "sci-fi": "🚀",
  romance: "💕",
  thriller: "🔪",
  animation: "🎬",
  adventure: "🗺️",
  fantasy: "🐉",
  mystery: "🔍",
  documentary: "📽️",
  crime: "🕵️",
  family: "👨‍👩‍👧‍👦",
  music: "🎵",
};

export function GenreSelector({
  selectedSlug,
  onSelect,
  disabled = false,
}: GenreSelectorProps) {
  return (
    <div className="space-y-4">
      <p className="text-sm font-medium text-zinc-400">
        Выбери жанр (опционально)
      </p>
      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => onSelect(null)}
          disabled={disabled}
          className={`rounded-full px-4 py-2 text-sm font-medium transition-all duration-200 ${
            selectedSlug === null
              ? "bg-gradient-gold text-noir-950 shadow-glow"
              : "bg-noir-700/80 text-zinc-300 hover:bg-noir-600 hover:text-white border border-white/5"
          } ${disabled ? "opacity-60 cursor-not-allowed" : ""}`}
        >
          Любой
        </button>
        {GENRES.map((genre) => {
          const isSelected = selectedSlug === genre.slug;
          const icon = GENRE_ICONS[genre.slug] ?? "🎞️";
          return (
            <button
              key={genre.id}
              type="button"
              onClick={() => onSelect(genre)}
              disabled={disabled}
              className={`rounded-full px-4 py-2 text-sm font-medium transition-all duration-200 flex items-center gap-1.5 ${
                isSelected
                  ? "bg-gradient-gold text-noir-950 shadow-glow"
                  : "bg-noir-700/80 text-zinc-300 hover:bg-noir-600 hover:text-white border border-white/5"
              } ${disabled ? "opacity-60 cursor-not-allowed" : ""}`}
            >
              <span aria-hidden>{icon}</span>
              {genre.name}
            </button>
          );
        })}
      </div>
    </div>
  );
}
