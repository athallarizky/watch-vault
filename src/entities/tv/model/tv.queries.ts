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
		queryFn: () => getPopularTv({ data: { page: 1 } }),
		staleTime: STALE_TIME,
	});
}

export function useTopRatedTv() {
	return useQuery({
		queryKey: ["tv", "top-rated"],
		queryFn: () => getTopRatedTv({ data: { page: 1 } }),
		staleTime: STALE_TIME,
	});
}

export function useOnTheAirTv() {
	return useQuery({
		queryKey: ["tv", "on-the-air"],
		queryFn: () => getOnTheAirTv({ data: { page: 1 } }),
		staleTime: STALE_TIME,
	});
}

export function useAiringTodayTv() {
	return useQuery({
		queryKey: ["tv", "airing-today"],
		queryFn: () => getAiringTodayTv({ data: { page: 1 } }),
		staleTime: STALE_TIME,
	});
}
