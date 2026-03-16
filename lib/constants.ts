import type { GenreOption } from "@/types/movie";

export const GENRES: GenreOption[] = [
  { id: "action", name: "Боевик", slug: "action" },
  { id: "comedy", name: "Комедия", slug: "comedy" },
  { id: "drama", name: "Драма", slug: "drama" },
  { id: "horror", name: "Ужасы", slug: "horror" },
  { id: "sci-fi", name: "Фантастика", slug: "sci-fi" },
  { id: "romance", name: "Романтика", slug: "romance" },
  { id: "thriller", name: "Триллер", slug: "thriller" },
  { id: "animation", name: "Анимация", slug: "animation" },
  { id: "adventure", name: "Приключения", slug: "adventure" },
  { id: "fantasy", name: "Фэнтези", slug: "fantasy" },
  { id: "mystery", name: "Детектив", slug: "mystery" },
  { id: "documentary", name: "Документальный", slug: "documentary" },
  { id: "crime", name: "Криминал", slug: "crime" },
  { id: "family", name: "Семейный", slug: "family" },
  { id: "music", name: "Музыкальный", slug: "music" },
];

export const RAPIDAPI_HOST = "imdb232.p.rapidapi.com";
