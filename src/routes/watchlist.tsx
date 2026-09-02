import { createFileRoute } from "@tanstack/react-router";
import { WatchlistPage } from "@/pages/watchlist";

export const Route = createFileRoute("/watchlist")({
	component: WatchlistPage,
});
