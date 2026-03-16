export interface Movie {
  id: string;
  title: string;
  fullTitle?: string;
  year?: string;
  image?: string;
  plot?: string;
  description?: string;
  rating?: string;
  imDbRating?: string;
  metacriticRating?: string;
  genres?: string;
  genreList?: { key: string; value: string }[];
  directors?: string;
  stars?: string;
  runtimeStr?: string;
  contentRating?: string;
  releaseDate?: string;
  tagline?: string;
  awards?: string;
  boxOffice?: string;
  companies?: string;
  countries?: string;
  languages?: string;
  keywords?: string;
  similars?: Movie[];
  errorMessage?: string;
}

export interface MovieSearchResult {
  id: string;
  title: string;
  fullTitle?: string;
  year?: string;
  image?: string;
  imDbRating?: string;
  rank?: string;
  crew?: string;
  description?: string;
  genreList?: { key: string; value: string }[];
}

export interface ApiSearchResponse {
  results?: MovieSearchResult[];
  searchType?: string;
  expression?: string;
  errorMessage?: string;
}

export interface GenreOption {
  id: string;
  name: string;
  slug: string;
  icon?: string;
}
