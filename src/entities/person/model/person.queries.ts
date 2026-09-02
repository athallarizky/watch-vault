import { useQuery } from "@tanstack/react-query";
import {
	getPersonCombinedCredits,
	getPersonDetails,
	getPopularPeople,
} from "@/server/server-functions";

const STALE_TIME = 5 * 60_000;

export function usePopularPeople() {
	return useQuery({
		queryKey: ["person", "popular"],
		queryFn: () => getPopularPeople(),
		staleTime: STALE_TIME,
	});
}

export function usePersonDetails(personId: number) {
	return useQuery({
		queryKey: ["person", "details", personId],
		queryFn: () => getPersonDetails({ data: { personId } }),
		staleTime: STALE_TIME,
	});
}

export function usePersonCredits(personId: number) {
	return useQuery({
		queryKey: ["person", "credits", personId],
		queryFn: () => getPersonCombinedCredits({ data: { personId } }),
		staleTime: STALE_TIME,
	});
}
