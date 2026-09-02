import { createServerFn } from "@tanstack/react-start";
import {
	mapMovieCredits,
	mapMovieDetails,
	mapMovieList,
} from "@/entities/movie/api/movie.mapper";
import type {
	IMovieDetailsApi,
	TMovieApiListResponse,
	TMovieCreditsApi,
} from "@/entities/movie/model/movie.types";
import {
	mapPersonCredits,
	mapPersonDetails,
	mapPersonList,
} from "@/entities/person/api/person.mapper";
import type {
	IPersonDetailsApi,
	TPersonApiListResponse,
	TPersonCombinedCreditsApi,
} from "@/entities/person/model/person.types";
import {
	mapTvCredits,
	mapTvShowDetails,
	mapTvShowList,
} from "@/entities/tv/api/tv.mapper";
import type {
	ITvShowDetailsApi,
	TTvApiListResponse,
	TTvCreditsApi,
} from "@/entities/tv/model/tv.types";
import { tmdbGet } from "./tmdb";

// Movie
export const getPopularMovies = createServerFn({ method: "GET" })
	.validator((data: { page: number }) => data)
	.handler(({ data }) =>
		tmdbGet<TMovieApiListResponse>("/movie/popular", {
			page: data.page,
		}).then(mapMovieList),
	);

export const getTopRatedMovies = createServerFn({ method: "GET" })
	.validator((data: { page: number }) => data)
	.handler(({ data }) =>
		tmdbGet<TMovieApiListResponse>("/movie/top_rated", {
			page: data.page,
		}).then(mapMovieList),
	);

export const getUpcomingMovies = createServerFn({ method: "GET" })
	.validator((data: { page: number }) => data)
	.handler(({ data }) =>
		tmdbGet<TMovieApiListResponse>("/movie/upcoming", {
			page: data.page,
		}).then(mapMovieList),
	);

export const getNowPlayingMovies = createServerFn({ method: "GET" })
	.validator((data: { page: number }) => data)
	.handler(({ data }) =>
		tmdbGet<TMovieApiListResponse>("/movie/now_playing", {
			page: data.page,
		}).then(mapMovieList),
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

export const getMovieCredits = createServerFn({ method: "GET" })
	.validator((data: { movieId: number }) => data)
	.handler(({ data }) =>
		tmdbGet<TMovieCreditsApi>(`/movie/${data.movieId}/credits`).then(
			mapMovieCredits,
		),
	);

// TV
export const getPopularTv = createServerFn({ method: "GET" })
	.validator((data: { page: number }) => data)
	.handler(({ data }) =>
		tmdbGet<TTvApiListResponse>("/tv/popular", { page: data.page }).then(
			mapTvShowList,
		),
	);
export const getTopRatedTv = createServerFn({ method: "GET" })
	.validator((data: { page: number }) => data)
	.handler(({ data }) =>
		tmdbGet<TTvApiListResponse>("/tv/top_rated", { page: data.page }).then(
			mapTvShowList,
		),
	);
export const getOnTheAirTv = createServerFn({ method: "GET" })
	.validator((data: { page: number }) => data)
	.handler(({ data }) =>
		tmdbGet<TTvApiListResponse>("/tv/on_the_air", { page: data.page }).then(
			mapTvShowList,
		),
	);
export const getAiringTodayTv = createServerFn({ method: "GET" })
	.validator((data: { page: number }) => data)
	.handler(({ data }) =>
		tmdbGet<TTvApiListResponse>("/tv/airing_today", {
			page: data.page,
		}).then(mapTvShowList),
	);

export const getTvDetails = createServerFn({ method: "GET" })
	.validator((data: { tvId: number }) => data)
	.handler(({ data }) =>
		tmdbGet<ITvShowDetailsApi>(`/tv/${data.tvId}`).then(mapTvShowDetails),
	);

export const getTvCredits = createServerFn({ method: "GET" })
	.validator((data: { tvId: number }) => data)
	.handler(({ data }) =>
		tmdbGet<TTvCreditsApi>(`/tv/${data.tvId}/credits`).then(mapTvCredits),
	);

// People
export const getPopularPeople = createServerFn({ method: "GET" })
	.validator((data: { page: number }) => data)
	.handler(({ data }) =>
		tmdbGet<TPersonApiListResponse>("/person/popular", {
			page: data.page,
		}).then(mapPersonList),
	);

export const getPersonDetails = createServerFn({ method: "GET" })
	.validator((data: { personId: number }) => data)
	.handler(({ data }) =>
		tmdbGet<IPersonDetailsApi>(`/person/${data.personId}`).then(
			mapPersonDetails,
		),
	);

export const getPersonCombinedCredits = createServerFn({ method: "GET" })
	.validator((data: { personId: number }) => data)
	.handler(({ data }) =>
		tmdbGet<TPersonCombinedCreditsApi>(
			`/person/${data.personId}/combined_credits`,
		).then(mapPersonCredits),
	);
