"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { GenreSelector } from "./GenreSelector";
import type { GenreOption } from "@/types/movie";
import { Film, Loader2 } from "lucide-react";

export function RandomPicker() {
  const router = useRouter();
  const [selectedGenre, setSelectedGenre] = useState<GenreOption | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handlePick = async () => {
    setError(null);
    setLoading(true);
    try {
      const url = selectedGenre
        ? `/api/movies/random?genre=${encodeURIComponent(selectedGenre.slug)}`
        : "/api/movies/random";
      const res = await fetch(url);
      const data = await res.json();
      if (!res.ok) {
        const msg = data.message ?? data.error ?? "Не удалось загрузить фильм";
        const detail = data.detail ? ` (${data.detail})` : "";
        setError(msg + detail);
        setLoading(false);
        return;
      }
      router.push(`/movie/${encodeURIComponent(data.id)}?genre=${selectedGenre?.slug ?? ""}`);
    } catch (e) {
      setError("Ошибка сети. Проверьте подключение.");
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      <GenreSelector
        selectedSlug={selectedGenre?.slug ?? null}
        onSelect={setSelectedGenre}
        disabled={loading}
      />
      <div className="flex flex-col items-center gap-4">
        <button
          type="button"
          onClick={handlePick}
          disabled={loading}
          className="group relative inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-gold px-8 py-4 text-lg font-semibold text-noir-950 shadow-glow hover:shadow-glow-strong transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed"
        >
          {loading ? (
            <>
              <Loader2 className="h-5 w-5 animate-spin" aria-hidden />
              Подбираем фильм...
            </>
          ) : (
            <>
              <Film className="h-5 w-5" aria-hidden />
              Подобрать случайный фильм
            </>
          )}
        </button>
        {error && (
          <p className="text-sm text-red-400 bg-red-950/30 px-4 py-2 rounded-lg max-w-md text-center">
            {error}
          </p>
        )}
      </div>
    </div>
  );
}
