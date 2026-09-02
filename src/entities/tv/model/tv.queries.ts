import { useQuery } from "@tanstack/react-query";
import {
	getAiringTodayTv,
	getOnTheAirTv,
	getPopularTv,
	getTopRatedTv,
} from "@/server/server-functions";

const STALE_TIME = 5 * 60_000;

export function usePopularTv() {
	return useQuery({
		queryKey: ["tv", "popular"],
		queryFn: () => getPopularTv(),
		staleTime: STALE_TIME,
	});
}

export function useTopRatedTv() {
	return useQuery({
		queryKey: ["tv", "top-rated"],
		queryFn: () => getTopRatedTv(),
		staleTime: STALE_TIME,
	});
}

export function useOnTheAirTv() {
	return useQuery({
		queryKey: ["tv", "on-the-air"],
		queryFn: () => getOnTheAirTv(),
		staleTime: STALE_TIME,
	});
}

export function useAiringTodayTv() {
	return useQuery({
		queryKey: ["tv", "airing-today"],
		queryFn: () => getAiringTodayTv(),
		staleTime: STALE_TIME,
	});
}
