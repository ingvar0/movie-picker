import { NextRequest } from "next/server";
import { getTitleById, getOmdbErrorHint } from "@/lib/api";
import type { Movie } from "@/types/movie";

function getStr(o: Record<string, unknown>, key: string): string | undefined {
  const v = o[key];
  return typeof v === "string" ? v : undefined;
}
function getNum(o: Record<string, unknown>, key: string): string | undefined {
  const v = o[key];
  if (typeof v === "number") return String(v);
  return typeof v === "string" ? v : undefined;
}

/** Извлекаем объект фильма из ответа (может быть data, results[0] или сам объект) */
function unwrapResponse(data: unknown): Record<string, unknown> | null {
  if (!data || typeof data !== "object") return null;
  const d = data as Record<string, unknown>;
  if (d.data && typeof d.data === "object" && !Array.isArray(d.data))
    return d.data as Record<string, unknown>;
  if (Array.isArray(d.results) && d.results.length > 0 && typeof d.results[0] === "object")
    return d.results[0] as Record<string, unknown>;
  return d;
}

function normalizeTitle(data: unknown): Movie | null {
  const d = unwrapResponse(data);
  if (!d) return null;
  const id = getStr(d, "id") ?? getStr(d, "imdbId") ?? getStr(d, "imdbID") ?? "";
  const title =
    getStr(d, "title") ?? getStr(d, "Title") ?? getStr(d, "l") ?? getStr(d, "fullTitle") ?? "";
  if (!id || !title) return null;

  return {
    id,
    title,
    fullTitle: getStr(d, "fullTitle") ?? getStr(d, "Title") ?? title,
    year: getStr(d, "year") ?? getStr(d, "Year"),
    image: getStr(d, "image") ?? getStr(d, "Poster"),
    plot: getStr(d, "plot") || getStr(d, "Plot") || getStr(d, "description"),
    description: getStr(d, "description") || getStr(d, "plot") || getStr(d, "Plot"),
    rating: getNum(d, "imDbRating") || getStr(d, "imdbRating") || getStr(d, "rating"),
    imDbRating: getNum(d, "imDbRating") || getStr(d, "imdbRating") || getStr(d, "imDbRating"),
    metacriticRating: getStr(d, "metacriticRating"),
    genres: getStr(d, "genres") ?? getStr(d, "Genre"),
    directors: getStr(d, "directors") ?? getStr(d, "Director"),
    stars: getStr(d, "stars") ?? getStr(d, "Actors"),
    runtimeStr: getStr(d, "runtimeStr") ?? getStr(d, "Runtime"),
    contentRating: getStr(d, "contentRating") ?? getStr(d, "Rated"),
    releaseDate: getStr(d, "releaseDate") ?? getStr(d, "Released"),
    tagline: getStr(d, "tagline"),
    awards: getStr(d, "awards") ?? getStr(d, "Awards"),
    boxOffice: getStr(d, "boxOffice"),
    companies: getStr(d, "companies"),
    countries: getStr(d, "countries") ?? getStr(d, "Country"),
    languages: getStr(d, "languages") ?? getStr(d, "Language"),
    keywords: getStr(d, "keywords"),
    errorMessage: getStr(d, "errorMessage") ?? getStr(d, "Error"),
  };
}

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  if (!id) {
    return Response.json({ error: "Missing id" }, { status: 400 });
  }

  try {
    const data = await getTitleById(id);
    const movie = normalizeTitle(data);
    if (!movie) {
      return Response.json({ error: "Invalid response" }, { status: 502 });
    }
    if (movie.errorMessage) {
      return Response.json(
        { error: movie.errorMessage },
        { status: 404 }
      );
    }
    return Response.json(movie);
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Failed to fetch title";
    console.error("Title fetch error:", msg);
    const hint = await getOmdbErrorHint(id);
    const envKey = process.env.OMDB_API_KEY ? "задан" : "не задан";
    const defaultDesc =
      envKey === "не задан"
        ? "В .env.local добавьте строку: OMDB_API_KEY=ваш_ключ (ключ бесплатно на omdbapi.com/apikey.aspx). Затем перезапустите npm run dev."
        : "Перезапустите сервер (Ctrl+C, затем npm run dev) после изменения .env.local. Если ключ уже добавлен — проверьте письмо от OMDb и перейдите по ссылке активации ключа.";
    const minimalMovie: Movie = {
      id,
      title: "Фильм",
      fullTitle: "Фильм (детали недоступны)",
      description: hint ?? defaultDesc,
      plot: hint ?? defaultDesc,
    };
    return Response.json(minimalMovie);
  }
}
