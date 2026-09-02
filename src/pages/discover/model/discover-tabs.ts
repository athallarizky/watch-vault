import { useQuery } from "@tanstack/react-query";
import {
	getAiringTodayTv,
	getNowPlayingMovies,
	getOnTheAirTv,
	getPopularMovies,
	getPopularPeople,
	getPopularTv,
	getTopRatedMovies,
	getTopRatedTv,
	getUpcomingMovies,
} from "@/server/server-functions";

const STALE_TIME = 5 * 60_000;

/**
 * Tab catalog for the Discover page. Query keys intentionally mirror the
 * entity hooks (movie.queries / tv.queries)
 */
export const DISCOVER_TABS = [
	{
		id: "popular",
		label: "Popular",
		kind: "movie",
		queryKey: ["movies", "popular"],
		queryFn: getPopularMovies,
	},
	{
		id: "top-rated",
		label: "Top Rated",
		kind: "movie",
		queryKey: ["movies", "top-rated"],
		queryFn: getTopRatedMovies,
	},
	{
		id: "upcoming",
		label: "Upcoming",
		kind: "movie",
		queryKey: ["movies", "upcoming"],
		queryFn: getUpcomingMovies,
	},
	{
		id: "now-playing",
		label: "Now Playing",
		kind: "movie",
		queryKey: ["movies", "now-playing"],
		queryFn: getNowPlayingMovies,
	},
	{
		id: "tv-popular",
		label: "Popular TV",
		kind: "tv",
		queryKey: ["tv", "popular"],
		queryFn: getPopularTv,
	},
	{
		id: "tv-top-rated",
		label: "Top Rated TV",
		kind: "tv",
		queryKey: ["tv", "top-rated"],
		queryFn: getTopRatedTv,
	},
	{
		id: "tv-on-the-air",
		label: "On The Air",
		kind: "tv",
		queryKey: ["tv", "on-the-air"],
		queryFn: getOnTheAirTv,
	},
	{
		id: "tv-airing-today",
		label: "Airing Today",
		kind: "tv",
		queryKey: ["tv", "airing-today"],
		queryFn: getAiringTodayTv,
	},
	{
		id: "people",
		label: "Popular People",
		kind: "person",
		queryKey: ["person", "popular"],
		queryFn: getPopularPeople,
	},
] as const;

export type TTabId = (typeof DISCOVER_TABS)[number]["id"];

type TTab = (typeof DISCOVER_TABS)[number];

// Derived from the actual server-fn return types (TanStack Start passes
// them through a serializer transform that defeats naive assignability).
export type TDiscoverData = Awaited<ReturnType<TTab["queryFn"]>>;

export function getTab(id: TTabId): TTab {
	return DISCOVER_TABS.find((tab) => tab.id === id) ?? DISCOVER_TABS[0];
}

/** Guards untrusted URL input before it reaches getTab. */
export function isTabId(value: string): value is TTabId {
	return DISCOVER_TABS.some((tab) => tab.id === value);
}

export function useDiscoverTab(id: TTabId) {
	const tab = getTab(id);
	return useQuery({
		queryKey: tab.queryKey,
		// The serializer transform above makes the per-tab fn types
		// individually unassignable to the union; one guarded cast keeps
		// the catalog data-driven instead of eight hand-written hooks.
		queryFn: () => (tab.queryFn as unknown as () => Promise<TDiscoverData>)(),
		staleTime: STALE_TIME,
	});
}
