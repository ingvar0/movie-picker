"use client";

import Image from "next/image";
import type { Movie } from "@/types/movie";

interface MovieCardProps {
  movie: Movie;
  compact?: boolean;
}

export function MovieCard({ movie, compact = false }: MovieCardProps) {
  const rating = movie.imDbRating ?? movie.rating;
  const description = movie.plot ?? movie.description ?? "";

  if (compact) {
    return (
      <article className="glass rounded-2xl overflow-hidden flex gap-4 p-4 animate-fade-in">
        {movie.image && (
          <div className="relative w-24 h-36 shrink-0 rounded-lg overflow-hidden bg-noir-700">
            <Image
              src={movie.image}
              alt=""
              fill
              className="object-cover"
              sizes="96px"
            />
          </div>
        )}
        <div className="min-w-0 flex-1">
          <h2 className="font-display font-semibold text-lg text-white truncate">
            {movie.title}
          </h2>
          {movie.year && (
            <p className="text-sm text-zinc-400">{movie.year}</p>
          )}
          {rating && (
            <p className="text-gold-400 font-medium mt-1">★ {rating}</p>
          )}
        </div>
      </article>
    );
  }

  return (
    <article className="glass-strong rounded-2xl overflow-hidden animate-scale-in max-w-2xl mx-auto">
      <div className="grid sm:grid-cols-[280px_1fr] gap-0">
        {movie.image && (
          <div className="relative w-full aspect-[2/3] sm:aspect-auto sm:h-full min-h-[320px] bg-noir-700">
            <Image
              src={movie.image}
              alt=""
              fill
              className="object-cover"
              sizes="(max-width: 640px) 100vw, 280px"
              priority
            />
            {rating && (
              <div className="absolute bottom-3 left-3 right-3 flex justify-between items-center">
                <span className="bg-noir-900/90 backdrop-blur px-3 py-1.5 rounded-lg font-semibold text-gold-400 flex items-center gap-1">
                  ★ {rating}
                </span>
                {movie.contentRating && (
                  <span className="bg-noir-900/90 backdrop-blur px-2 py-1 rounded text-xs text-zinc-300">
                    {movie.contentRating}
                  </span>
                )}
              </div>
            )}
          </div>
        )}
        <div className="p-6 sm:p-8 flex flex-col">
          <div className="mb-4">
            <h1 className="font-display text-2xl sm:text-3xl font-semibold text-white leading-tight">
              {movie.fullTitle ?? movie.title}
            </h1>
            <div className="flex flex-wrap gap-x-4 gap-y-1 mt-2 text-sm text-zinc-400">
              {movie.year && <span>{movie.year}</span>}
              {movie.runtimeStr && <span>{movie.runtimeStr}</span>}
              {movie.genres && <span>{movie.genres}</span>}
            </div>
          </div>
          {description && (
            <p className="text-zinc-300 text-sm sm:text-base leading-relaxed flex-1">
              {description}
            </p>
          )}
          {movie.directors && (
            <p className="mt-4 text-sm">
              <span className="text-zinc-500">Режиссёр: </span>
              <span className="text-zinc-300">{movie.directors}</span>
            </p>
          )}
          {movie.stars && (
            <p className="mt-1 text-sm">
              <span className="text-zinc-500">В ролях: </span>
              <span className="text-zinc-300">{movie.stars}</span>
            </p>
          )}
          {movie.tagline && (
            <p className="mt-4 text-sm italic text-gold-400/90">
              «{movie.tagline}»
            </p>
          )}
          {movie.awards && (
            <p className="mt-3 text-xs text-zinc-500 line-clamp-2">
              {movie.awards}
            </p>
          )}
        </div>
      </div>
    </article>
  );
}
