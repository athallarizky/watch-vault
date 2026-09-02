import { useQuery } from "@tanstack/react-query";
import {
	getAiringTodayTv,
	getOnTheAirTv,
	getPopularTv,
	getTopRatedTv,
	getTvCredits,
	getTvDetails,
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

export function useTvDetails(tvId: number) {
	return useQuery({
		queryKey: ["tv", "details", tvId],
		queryFn: () => getTvDetails({ data: { tvId } }),
		staleTime: STALE_TIME,
	});
}

export function useTvCredits(tvId: number) {
	return useQuery({
		queryKey: ["tv", "credits", tvId],
		queryFn: () => getTvCredits({ data: { tvId } }),
		staleTime: STALE_TIME,
	});
}
