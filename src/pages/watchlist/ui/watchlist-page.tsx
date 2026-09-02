import { Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { MovieCard } from "@/entities/movie/ui/movie-card";
import { useWatchList } from "@/features/watchlist";

const GRID_CLASS =
	"grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6";

/** Composed empty state: what the page is for and how to fill it. */
function EmptyWatchlist() {
	return (
		<div className="flex min-h-[50vh] flex-col items-center justify-center gap-4 py-16 text-center">
			<img
				src="/assets/watchlist-empty.gif"
				alt=""
				aria-hidden="true"
				draggable={false}
				className="w-44 rounded-lg"
			/>
			<div className="space-y-1">
				<p className="text-lg font-medium">Your watchlist is empty</p>
				<p className="text-sm text-muted-foreground">
					Save movies while browsing and they will show up here.
				</p>
			</div>
			<Button asChild>
				<Link to="/discover" search={{ tab: "popular" }}>
					Browse Discover
				</Link>
			</Button>
		</div>
	);
}

export function WatchlistPage() {
	const { items } = useWatchList();

	return (
		<main className="mx-auto w-[min(1280px,100%-2rem)] space-y-6 py-8">
			<h1 className="text-display-md">Watchlist</h1>

			{items.length === 0 ? (
				<EmptyWatchlist />
			) : (
				<>
					<p className="text-sm text-muted-foreground">
						{items.length} saved {items.length === 1 ? "movie" : "movies"}
					</p>
					<div className={GRID_CLASS}>
						{items.map((movie) => (
							<MovieCard key={movie.id} movie={movie} />
						))}
					</div>
				</>
			)}
		</main>
	);
}
