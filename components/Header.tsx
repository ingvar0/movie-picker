"use client";

import Link from "next/link";

export function Header() {
  return (
    <header className="border-b border-white/5 bg-noir-950/50 backdrop-blur supports-[backdrop-filter]:bg-noir-950/30">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 py-4 flex items-center justify-between">
        <Link
          href="/"
          className="font-display text-xl font-semibold text-white hover:text-gold-400 transition-colors flex items-center gap-2"
        >
          <span className="text-2xl" aria-hidden>
            🎬
          </span>
          Movie Picker
        </Link>
        <nav className="flex items-center gap-4">
          <Link
            href="/"
            className="text-sm text-zinc-400 hover:text-white transition-colors"
          >
            Главная
          </Link>
        </nav>
      </div>
    </header>
  );
}
