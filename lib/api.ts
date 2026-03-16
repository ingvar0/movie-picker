function getApiKey(): string {
  const raw = process.env.RAPIDAPI_KEY;
  if (!raw) throw new Error("RAPIDAPI_KEY is not set");
  const key = raw.trim().replace(/^['"]|['"]$/g, "");
  if (!key) throw new Error("RAPIDAPI_KEY is empty after trim");
  return key;
}

const getHeaders = () => {
  const host = process.env.RAPIDAPI_HOST?.trim() || "imdb232.p.rapidapi.com";
  return {
    "x-rapidapi-key": getApiKey(),
    "x-rapidapi-host": host.replace(/^['"]|['"]$/g, ""),
  };
};

const baseUrl = (host: string) => `https://${host}`;
const apiPath = (host: string, path: string) => `${baseUrl(host)}/api${path}`;

/** GET /api/autocomplete — подсказки по запросу (imdb232 использует префикс /api) */
export async function autocomplete(query: string): Promise<unknown> {
  const host = process.env.RAPIDAPI_HOST?.trim() || "imdb232.p.rapidapi.com";
  const url = apiPath(host, `/autocomplete?q=${encodeURIComponent(query)}`);
  const res = await fetch(url, { headers: getHeaders() });
  const text = await res.text();
  if (!res.ok) {
    throw new Error(`Autocomplete failed: ${res.status}. Body: ${text.slice(0, 200)}`);
  }
  try {
    return JSON.parse(text);
  } catch {
    throw new Error(`Autocomplete invalid JSON: ${text.slice(0, 100)}`);
  }
}

/** OMDb API — бесплатный ключ на omdbapi.com/apikey.aspx, 1000 запросов/день */
export async function getTitleByOmdb(id: string): Promise<unknown> {
  const raw = process.env.OMDB_API_KEY;
  if (!raw) return null;
  const key = raw.trim().replace(/^['"]|['"]$/g, "");
  if (!key) return null;
  const cleanId = id.replace(/^['"]|['"]$/g, "").trim();
  if (!cleanId) return null;
  const url = `https://www.omdbapi.com/?i=${encodeURIComponent(cleanId)}&apikey=${encodeURIComponent(key)}&plot=full&`;
  const res = await fetch(url);
  const text = await res.text();
  if (!res.ok) return null;
  try {
    const json = JSON.parse(text) as { Response?: string; Error?: string; Title?: string };
    if (json?.Response === "False" && json?.Error) return null;
    if (json?.Response === "True" && json?.Title) return json;
    return null;
  } catch {
    return null;
  }
}

/** Вызов OMDb и возврат текста ошибки, если ключ неверный или лимит — чтобы показать пользователю */
export async function getOmdbErrorHint(id: string): Promise<string | null> {
  const raw = process.env.OMDB_API_KEY;
  if (!raw) return "В .env.local нет OMDB_API_KEY. Добавьте ключ с omdbapi.com/apikey.aspx";
  const key = raw.trim().replace(/^['"]|['"]$/g, "");
  if (!key) return "OMDB_API_KEY пустой в .env.local";
  const url = `https://www.omdbapi.com/?i=${encodeURIComponent(id)}&apikey=${encodeURIComponent(key)}&`;
  try {
    const res = await fetch(url);
    const json = (await res.json()) as { Response?: string; Error?: string };
    if (json?.Response === "False" && json?.Error)
      return `OMDb: ${json.Error} Скопируйте ключ из письма после активации или со страницы omdbapi.com/apikey.aspx. В .env.local строка: OMDB_API_KEY=ключ (без кавычек и пробелов). Перезапустите npm run dev.`;
  } catch {
    // ignore
  }
  return null;
}

/** RapidAPI title (imdb232 — эндпоинт может отсутствовать) */
async function getTitleByRapidApi(id: string): Promise<unknown> {
  const host = process.env.RAPIDAPI_HOST?.trim() || "imdb232.p.rapidapi.com";
  const cleanId = id.replace(/^['"]|['"]$/g, "").trim();
  if (!cleanId) return null;
  const headers = getHeaders();
  const enc = encodeURIComponent(cleanId);
  const urls = [
    apiPath(host, `/title?id=${enc}`),
    apiPath(host, `/title?ids=${enc}`),
    `${baseUrl(host)}/title?id=${enc}`,
    `${baseUrl(host)}/title?ids=${enc}`,
  ];
  for (const url of urls) {
    const res = await fetch(url, { headers });
    if (!res.ok) continue;
    try {
      const json = JSON.parse(await res.text());
      if (json && typeof json === "object") return json;
    } catch {
      // skip
    }
  }
  return null;
}

/** Сначала OMDb (работает), потом RapidAPI title */
export async function getTitleById(id: string): Promise<unknown> {
  const omdb = await getTitleByOmdb(id);
  if (omdb) return omdb;
  const rapid = await getTitleByRapidApi(id);
  if (rapid) return rapid;
  throw new Error("Title not found (add OMDB_API_KEY to .env.local — free at omdbapi.com/apikey.aspx)");
}

/** POST /advanceSearch — поиск по жанру и типу (есть в imdb232) */
export async function advanceSearch(params: {
  genres?: string;
  title_type?: string;
  sort?: string;
  count?: number;
  start?: number;
}): Promise<unknown> {
  const host = process.env.RAPIDAPI_HOST?.trim() || "imdb232.p.rapidapi.com";
  const body: Record<string, string | number> = {
    title_type: params.title_type ?? "movie",
    count: params.count ?? 30,
    start: params.start ?? 1,
  };
  if (params.genres) body.genres = params.genres;
  if (params.sort) body.sort = params.sort;

  const url = apiPath(host, "/advanceSearch");
  const res = await fetch(url, {
    method: "POST",
    headers: {
      ...getHeaders(),
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });
  const text = await res.text();
  if (!res.ok) {
    throw new Error(`Advance search failed: ${res.status}. Body: ${text.slice(0, 200)}`);
  }
  try {
    return JSON.parse(text);
  } catch {
    throw new Error(`Advance search invalid JSON: ${text.slice(0, 100)}`);
  }
}
