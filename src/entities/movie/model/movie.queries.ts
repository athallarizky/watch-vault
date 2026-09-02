import { keepPreviousData, useQuery } from "@tanstack/react-query";
import {
	getMovieDetails,
	getNowPlayingMovies,
	getPopularMovies,
	getTopRatedMovies,
	getUpcomingMovies,
	searchMovies,
} from "@/server/server-functions";

const STALE_TIME = 5 * 60_000; // caching 5min

export function usePopularMovies() {
	return useQuery({
		queryKey: ["movies", "popular"],
		queryFn: () => getPopularMovies(),
		staleTime: STALE_TIME,
	});
}

export function useTopRatedMovies() {
	return useQuery({
		queryKey: ["movies", "top-rated"],
		queryFn: () => getTopRatedMovies(),
		staleTime: STALE_TIME,
	});
}

export function useUpcomingMovies() {
	return useQuery({
		queryKey: ["movies", "upcoming"],
		queryFn: () => getUpcomingMovies(),
		staleTime: STALE_TIME,
	});
}

export function useNowPlayingMovies() {
	return useQuery({
		queryKey: ["movies", "now-playing"],
		queryFn: () => getNowPlayingMovies(),
		staleTime: STALE_TIME,
	});
}

export function useMovieDetails(movieId: number) {
	return useQuery({
		queryKey: ["movie", "details", movieId],
		queryFn: () => getMovieDetails({ data: { movieId } }),
		staleTime: STALE_TIME,
	});
}

export function useSearchMovies(query: string) {
	return useQuery({
		queryKey: ["movies", "search", query],
		queryFn: () => searchMovies({ data: { query } }),
		enabled: !!query,
		placeholderData: keepPreviousData,
	});
}
