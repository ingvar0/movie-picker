"use client";

import type { Movie } from "@/types/movie";

const IMDb_TITLE_URL = "https://www.imdb.com/title/";

interface ReviewsSectionProps {
  movie: Movie;
}

export function ReviewsSection({ movie }: ReviewsSectionProps) {
  const rating = movie.imDbRating ?? movie.rating;
  const metacritic = movie.metacriticRating;
  const imdbUrl = movie.id ? `${IMDb_TITLE_URL}${movie.id}/` : null;

  const items: { label: string; value: string; source?: string }[] = [];
  if (rating) items.push({ label: "IMDb", value: rating, source: "imdb" });
  if (metacritic)
    items.push({ label: "Metacritic", value: metacritic, source: "metacritic" });

  if (items.length === 0 && !imdbUrl) return null;

  return (
    <section className="mt-6 pt-6 border-t border-white/10">
      <h3 className="text-sm font-medium text-zinc-400 mb-3">Оценки</h3>
      <div className="flex flex-wrap gap-4">
        {items.map(({ label, value, source }) => (
          <div
            key={label}
            className="flex items-center gap-2 bg-noir-700/50 rounded-xl px-4 py-2"
          >
            <span className="text-zinc-400 text-sm">{label}</span>
            <span
              className={`font-semibold ${
                source === "imdb" ? "text-gold-400" : "text-amber-400"
              }`}
            >
              {value}
            </span>
          </div>
        ))}
      </div>
      {imdbUrl && (
        <p className="text-xs text-zinc-500 mt-3">
          <a
            href={imdbUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-gold-400 hover:text-gold-300 underline"
          >
            Открыть страницу фильма и отзывы на IMDb →
          </a>
        </p>
      )}
    </section>
  );
}
