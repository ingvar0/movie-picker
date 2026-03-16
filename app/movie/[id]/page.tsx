"use client";

import { useCallback, useEffect, useState } from "react";
import { useParams, useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { MovieCard } from "@/components/MovieCard";
import { ReviewsSection } from "@/components/ReviewsSection";
import type { Movie } from "@/types/movie";
import { Shuffle, Home, Loader2 } from "lucide-react";

export default function MoviePage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();
  const id = typeof params.id === "string" ? params.id : "";
  const genreFromQuery = searchParams.get("genre") ?? "";

  const [movie, setMovie] = useState<Movie | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchMovie = useCallback(async (movieId: string) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/movies/${encodeURIComponent(movieId)}`);
      const data = await res.json();
      if (!res.ok) {
        const base = data.message ?? data.error ?? "Фильм не найден";
        setError(data.detail ? `${base}: ${data.detail}` : base);
        setMovie(null);
        return;
      }
      setMovie(data as Movie);
    } catch {
      setError("Ошибка загрузки");
      setMovie(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (id) fetchMovie(id);
  }, [id, fetchMovie]);

  const handleAnother = async () => {
    setLoading(true);
    setError(null);
    try {
      const url = genreFromQuery
        ? `/api/movies/random?genre=${encodeURIComponent(genreFromQuery)}`
        : "/api/movies/random";
      const res = await fetch(url);
      const data = await res.json();
      if (!res.ok) {
        setError(data.message ?? data.error ?? "Не удалось подобрать фильм");
        setLoading(false);
        return;
      }
      const newMovie = data as Movie;
      router.replace(
        `/movie/${encodeURIComponent(newMovie.id)}?genre=${genreFromQuery}`,
        { scroll: false }
      );
      setMovie(newMovie);
    } catch {
      setError("Ошибка сети");
    } finally {
      setLoading(false);
    }
  };

  if (loading && !movie) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4">
        <Loader2 className="h-10 w-10 animate-spin text-gold-400" />
        <p className="text-zinc-400">Загружаем фильм...</p>
      </div>
    );
  }

  if (error && !movie) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-6 px-4">
        <p className="text-red-400 text-center">{error}</p>
        <Link
          href="/"
          className="inline-flex items-center gap-2 rounded-xl bg-noir-700 px-4 py-2 text-white hover:bg-noir-600"
        >
          <Home className="h-4 w-4" /> На главную
        </Link>
      </div>
    );
  }

  if (!movie) return null;

  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b border-white/5 bg-noir-950/50 backdrop-blur">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 py-4 flex items-center justify-between">
          <Link
            href="/"
            className="font-display text-xl font-semibold text-white hover:text-gold-400 transition-colors flex items-center gap-2"
          >
            🎬 Movie Picker
          </Link>
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="inline-flex items-center gap-2 rounded-xl bg-noir-700 px-4 py-2 text-sm text-zinc-300 hover:bg-noir-600 hover:text-white transition-colors"
            >
              <Home className="h-4 w-4" /> Главная
            </Link>
            <button
              type="button"
              onClick={handleAnother}
              disabled={loading}
              className="inline-flex items-center gap-2 rounded-xl bg-gradient-gold px-4 py-2 text-sm font-medium text-noir-950 hover:shadow-glow transition-all disabled:opacity-70"
            >
              {loading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Shuffle className="h-4 w-4" />
              )}
              Другой фильм
            </button>
          </div>
        </div>
      </header>

      <main className="flex-1 px-4 py-8 sm:py-12">
        <div className="mx-auto max-w-4xl space-y-6">
          <MovieCard movie={movie} />
          <ReviewsSection movie={movie} />
          {error && (
            <p className="text-sm text-red-400 text-center">{error}</p>
          )}
          <div className="flex flex-wrap justify-center gap-4 pt-4">
            <button
              type="button"
              onClick={handleAnother}
              disabled={loading}
              className="inline-flex items-center gap-2 rounded-xl bg-noir-700 px-5 py-2.5 text-white hover:bg-noir-600 transition-colors disabled:opacity-70"
            >
              {loading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Shuffle className="h-4 w-4" />
              )}
              Подобрать другой
            </button>
            <Link
              href="/"
              className="inline-flex items-center gap-2 rounded-xl border border-white/10 px-5 py-2.5 text-zinc-300 hover:bg-white/5 hover:text-white transition-colors"
            >
              <Home className="h-4 w-4" /> Выбрать жанр на главной
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
