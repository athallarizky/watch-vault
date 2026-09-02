import { createFileRoute } from "@tanstack/react-router";
import { DiscoverPage } from "@/pages/discover";

export const Route = createFileRoute("/discover")({
	// The active tab lives in the URL so rows can deep-link here (e.g. ?tab=tv-popular).
	validateSearch: (search: Record<string, unknown>): { tab: string } => ({
		tab: typeof search.tab === "string" ? search.tab : "popular",
	}),
	component: DiscoverPage,
});
