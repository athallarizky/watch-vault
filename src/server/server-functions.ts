import { createServerFn } from "@tanstack/react-start";
import type { TMovieListResponse } from "@/entities/movie/model/movie.types";
import type { TPersonListResponse } from "@/entities/person/model/person.types";
import type { TTvListResponse } from "@/entities/tv/model/tv.types";
import { tmdbGet } from "./tmdb";

// Movie
export const getPopularMovies = createServerFn({ method: "GET" }).handler(() =>
	tmdbGet<TMovieListResponse>("/movie/popular"),
);

export const getTopRatedMovies = createServerFn({ method: "GET" }).handler(() =>
	tmdbGet<TMovieListResponse>("/movie/top_rated"),
);

export const getUpcomingMovies = createServerFn({ method: "GET" }).handler(() =>
	tmdbGet<TMovieListResponse>("/movie/upcoming"),
);

export const getNowPlayingMovies = createServerFn({ method: "GET" }).handler(
	() => tmdbGet<TMovieListResponse>("/movie/now_playing"),
);

// TV
export const getPopularTv = createServerFn({ method: "GET" }).handler(() =>
	tmdbGet<TTvListResponse>("/tv/popular"),
);
export const getTopRatedTv = createServerFn({ method: "GET" }).handler(() =>
	tmdbGet<TTvListResponse>("/tv/top_rated"),
);
export const getOnTheAirTv = createServerFn({ method: "GET" }).handler(() =>
	tmdbGet<TTvListResponse>("/tv/on_the_air"),
);
export const getAiringTodayTv = createServerFn({ method: "GET" }).handler(() =>
	tmdbGet<TTvListResponse>("/tv/airing_today"),
);

// People
export const getPopularPeople = createServerFn({ method: "GET" }).handler(() =>
	tmdbGet<TPersonListResponse>("/person/popular"),
);
