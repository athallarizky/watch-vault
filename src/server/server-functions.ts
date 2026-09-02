import { createServerFn } from "@tanstack/react-start";
import {
	mapMovieDetails,
	mapMovieList,
} from "@/entities/movie/api/movie.mapper";
import type {
	IMovieDetailsApi,
	TMovieApiListResponse,
} from "@/entities/movie/model/movie.types";
import { mapPersonList } from "@/entities/person/api/person.mapper";
import type { TPersonApiListResponse } from "@/entities/person/model/person.types";
import { mapTvShowList } from "@/entities/tv/api/tv.mapper";
import type { TTvApiListResponse } from "@/entities/tv/model/tv.types";
import { tmdbGet } from "./tmdb";

// Movie
export const getPopularMovies = createServerFn({ method: "GET" }).handler(() =>
	tmdbGet<TMovieApiListResponse>("/movie/popular").then(mapMovieList),
);

export const getTopRatedMovies = createServerFn({ method: "GET" }).handler(() =>
	tmdbGet<TMovieApiListResponse>("/movie/top_rated").then(mapMovieList),
);

export const getUpcomingMovies = createServerFn({ method: "GET" }).handler(() =>
	tmdbGet<TMovieApiListResponse>("/movie/upcoming").then(mapMovieList),
);

export const getNowPlayingMovies = createServerFn({ method: "GET" }).handler(
	() => tmdbGet<TMovieApiListResponse>("/movie/now_playing").then(mapMovieList),
);

export const searchMovies = createServerFn({ method: "GET" })
	.validator((data: { query: string }) => data)
	.handler(({ data }) =>
		tmdbGet<TMovieApiListResponse>("/search/movie", {
			query: data.query,
		}).then(mapMovieList),
	);

export const getMovieDetails = createServerFn({ method: "GET" })
	.validator((data: { movieId: number }) => data)
	.handler(({ data }) =>
		tmdbGet<IMovieDetailsApi>(`/movie/${data.movieId}`).then(mapMovieDetails),
	);

// TV
export const getPopularTv = createServerFn({ method: "GET" }).handler(() =>
	tmdbGet<TTvApiListResponse>("/tv/popular").then(mapTvShowList),
);
export const getTopRatedTv = createServerFn({ method: "GET" }).handler(() =>
	tmdbGet<TTvApiListResponse>("/tv/top_rated").then(mapTvShowList),
);
export const getOnTheAirTv = createServerFn({ method: "GET" }).handler(() =>
	tmdbGet<TTvApiListResponse>("/tv/on_the_air").then(mapTvShowList),
);
export const getAiringTodayTv = createServerFn({ method: "GET" }).handler(() =>
	tmdbGet<TTvApiListResponse>("/tv/airing_today").then(mapTvShowList),
);

// People
export const getPopularPeople = createServerFn({ method: "GET" }).handler(() =>
	tmdbGet<TPersonApiListResponse>("/person/popular").then(mapPersonList),
);
