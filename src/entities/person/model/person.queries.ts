import { useQuery } from "@tanstack/react-query";
import { getPopularPeople } from "@/server/server-functions";

const STALE_TIME = 5 * 60_000;

export function usePopularPeople() {
	return useQuery({
		queryKey: ["person", "popular"],
		queryFn: () => getPopularPeople(),
		staleTime: STALE_TIME,
	});
}
