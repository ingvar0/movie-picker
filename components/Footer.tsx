"use client";

import Link from "next/link";

export function Footer() {
  return (
    <footer className="mt-auto border-t border-white/5 bg-noir-950/30">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 py-8">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-zinc-500">
            Данные о фильмах через RapidAPI · IMDb
          </p>
          <Link
            href="/"
            className="text-sm text-zinc-500 hover:text-gold-400 transition-colors"
          >
            Movie Picker
          </Link>
        </div>
      </div>
    </footer>
  );
}
