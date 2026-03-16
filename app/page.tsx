import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { RandomPicker } from "@/components/RandomPicker";

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 flex flex-col items-center justify-center px-4 py-12 sm:py-16">
        <div className="w-full max-w-3xl mx-auto text-center space-y-10 animate-fade-in">
          <div>
            <h1 className="font-display text-4xl sm:text-5xl md:text-6xl font-semibold text-white leading-tight">
              Что посмотреть сегодня?
            </h1>
            <p className="mt-4 text-lg text-zinc-400 max-w-xl mx-auto">
              Выбери жанр или нажми кнопку — мы подберём случайный фильм с
              описанием и оценками.
            </p>
          </div>
          <div className="glass rounded-3xl p-6 sm:p-8 text-left">
            <RandomPicker />
          </div>
          <div className="rounded-2xl bg-noir-800/40 border border-white/5 p-4 text-left max-w-xl mx-auto">
            <h2 className="text-sm font-medium text-zinc-400 mb-2">
              Как это работает
            </h2>
            <ul className="text-sm text-zinc-500 space-y-1">
              <li>· Выбери жанр или оставь «Любой»</li>
              <li>· Нажми «Подобрать случайный фильм»</li>
              <li>· Не понравилось? Нажми «Другой фильм» на странице фильма</li>
              <li>· Или вернись на главную и выбери другой жанр</li>
            </ul>
          </div>
          <p className="text-sm text-zinc-500">
            Данные о фильмах предоставлены через RapidAPI (IMDb).
          </p>
        </div>
      </main>
      <Footer />
    </div>
  );
}
