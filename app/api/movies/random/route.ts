import { NextRequest } from "next/server";
import { advanceSearch, autocomplete, getTitleById } from "@/lib/api";
import type { Movie, MovieSearchResult } from "@/types/movie";
import { GENRES } from "@/lib/constants";

function getResultsArray(data: unknown): { id: string; title?: string }[] | null {
  if (!data || typeof data !== "object") return null;
  const d = data as Record<string, unknown>;
  if (Array.isArray(d.results) && d.results.length > 0)
    return d.results as { id: string; title?: string }[];
  if (Array.isArray(d.data) && d.data.length > 0)
    return d.data as { id: string; title?: string }[];
  if (Array.isArray(d.titles) && d.titles.length > 0)
    return d.titles as { id: string; title?: string }[];
  if (Array.isArray(d) && d.length > 0) return d as { id: string; title?: string }[];
  return null;
}

function normalizeMovieFromSearch(item: MovieSearchResult): Movie {
  return {
    id: item.id,
    title: item.title,
    fullTitle: item.fullTitle,
    year: item.year,
    image: item.image,
    imDbRating: item.imDbRating,
    description: item.description,
    genreList: item.genreList,
  };
}

function pickRandom<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

const GENRE_TO_ADVANCE: Record<string, string> = {
  action: "action",
  comedy: "comedy",
  drama: "drama",
  horror: "horror",
  "sci-fi": "sci-fi",
  romance: "romance",
  thriller: "thriller",
  animation: "animation",
  adventure: "adventure",
  fantasy: "fantasy",
  mystery: "mystery",
  documentary: "documentary",
  crime: "crime",
  family: "family",
  music: "musical",
};

/** Из ответа autocomplete извлекаем массив с id (imdb232 часто отдаёт d[] с полями id, l) */
function getResultsFromAutocomplete(data: unknown): { id: string; title?: string }[] | null {
  if (!data || typeof data !== "object") return null;
  const d = data as Record<string, unknown>;
  const arr = Array.isArray(d.d) ? d.d : Array.isArray(d.results) ? d.results : null;
  if (!arr?.length) return null;
  return arr
    .map((item: unknown) => {
      const o = item as Record<string, unknown>;
      const id = typeof o.id === "string" ? o.id : typeof o.imdbId === "string" ? o.imdbId : null;
      if (!id || !id.startsWith("tt")) return null;
      const title = typeof o.l === "string" ? o.l : typeof o.title === "string" ? o.title : undefined;
      return { id, title };
    })
    .filter(Boolean) as { id: string; title?: string }[];
}

export async function GET(request: NextRequest) {
  const genreSlug = request.nextUrl.searchParams.get("genre") ?? "";
  const genreOption = GENRES.find((g) => g.slug === genreSlug);
  const advanceGenre = genreOption ? GENRE_TO_ADVANCE[genreOption.slug] ?? genreOption.name : undefined;

  try {
    let searchData: unknown;
    try {
      searchData = await advanceSearch({
        genres: advanceGenre,
        title_type: "movie",
        count: 50,
        start: 1,
      });
    } catch (advanceErr) {
      const msg = advanceErr instanceof Error ? advanceErr.message : String(advanceErr);
      if (msg.includes("does not exist") || msg.includes("404")) {
        const query = genreOption ? GENRE_TO_ADVANCE[genreOption.slug] || "movie" : "movie";
        searchData = await autocomplete(query + " movie");
        const autoList = getResultsFromAutocomplete(searchData);
        if (!autoList?.length) {
          return Response.json(
            { error: "No results", message: "Не найдено фильмов. Попробуйте другой жанр." },
            { status: 404 }
          );
        }
        const chosenFromAuto = autoList[Math.floor(Math.random() * autoList.length)];
        const detailRes = await fetch(
          `${request.nextUrl.origin}/api/movies/${encodeURIComponent(chosenFromAuto.id)}`
        );
        if (detailRes.ok) {
          const detail = (await detailRes.json()) as Movie;
          return Response.json(detail);
        }
        return Response.json({
          id: chosenFromAuto.id,
          title: chosenFromAuto.title ?? "Unknown",
        });
      }
      throw advanceErr;
    }

    const rawResults = getResultsArray(searchData);
    if (!rawResults?.length) {
      return Response.json(
        { error: "No results", message: "Не найдено фильмов по запросу." },
        { status: 404 }
      );
    }

    const results = rawResults.filter((r) => {
      const id = r.id || (r as Record<string, unknown>).imdbId;
      const sid = typeof id === "string" ? id : "";
      return sid && (sid.startsWith("tt") || /^tt\d+/.test(sid));
    });
    if (!results.length) {
      return Response.json(
        { error: "No valid results" },
        { status: 404 }
      );
    }

    const chosenRaw = pickRandom(results);
    const chosenId =
      typeof chosenRaw.id === "string"
        ? chosenRaw.id
        : String((chosenRaw as Record<string, unknown>).imdbId ?? chosenRaw);
    const chosen: MovieSearchResult = {
      id: chosenId,
      title: chosenRaw.title ?? "Unknown",
      fullTitle: (chosenRaw as MovieSearchResult).fullTitle,
      year: (chosenRaw as MovieSearchResult).year,
      image: (chosenRaw as MovieSearchResult).image,
      imDbRating: (chosenRaw as MovieSearchResult).imDbRating,
      description: (chosenRaw as MovieSearchResult).description,
      genreList: (chosenRaw as MovieSearchResult).genreList,
    };
    const detailRes = await fetch(
      `${request.nextUrl.origin}/api/movies/${encodeURIComponent(chosenId)}`
    );
    if (detailRes.ok) {
      const detail = (await detailRes.json()) as Movie;
      return Response.json(detail);
    }

    return Response.json(normalizeMovieFromSearch(chosen));
  } catch (err) {
    console.error("Random movie error:", err);
    const message =
      err instanceof Error ? err.message : "Ошибка при загрузке фильма.";
    const isKeyMissing =
      message.includes("RAPIDAPI_KEY") || message.includes("is not set");
    return Response.json(
      {
        error: "API_ERROR",
        message: isKeyMissing
          ? "Добавьте RAPIDAPI_KEY в .env.local. См. SETUP.md или README.md"
          : message,
        detail: err instanceof Error ? err.message : String(err),
      },
      { status: 500 }
    );
  }
}
