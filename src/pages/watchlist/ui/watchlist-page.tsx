import { Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { MovieCard } from "@/entities/movie/ui/movie-card";
import { useWatchList } from "@/features/watchlist";

const GRID_CLASS = "grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5";

export function WatchlistPage() {
	const { items } = useWatchList();

	return (
		<main className="mx-auto w-[min(1080px,100%-2rem)] space-y-6 py-8">
			<h1 className="text-2xl font-extrabold">Watchlist</h1>

			{items.length === 0 ? (
				<div className="space-y-4">
					<p className="text-sm text-muted-foreground">
						Your watchlist is empty. Browse Discover and save movies you want to
						watch.
					</p>
					<Button asChild>
						<Link to="/discover">Browse Discover</Link>
					</Button>
				</div>
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
