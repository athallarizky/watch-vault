import { useSearchMovies } from "@/entities/movie/model/movie.queries";
import { MovieCard } from "@/entities/movie/ui/movie-card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { SearchBar } from "@/features/search";
import { Route } from "@/routes/search";

const GRID_CLASS = "grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5";

function SkeletonGrid() {
	return (
		<div className={GRID_CLASS}>
			{Array.from({ length: 10 }).map((_, i) => (
				// biome-ignore lint/suspicious/noArrayIndexKey: static placeholder list, never reordered
				<Skeleton key={i} className="aspect-[2/3] w-full rounded-md" />
			))}
		</div>
	);
}

export function SearchPage() {
	const { q } = Route.useSearch();
	const { data, isLoading, isError, refetch } = useSearchMovies(q ?? "");

	// Empty query is checked first: with enabled=false the query stays pending
	// forever, so a loading branch here would swallow the initial prompt.
	if (!q) {
		return (
			<main className="mx-auto w-[min(1080px,100%-2rem)] space-y-6 py-8">
				<h1 className="text-2xl font-extrabold">Search</h1>
				<SearchBar defaultValue="" />
				<p className="text-sm text-muted-foreground">
					Type to search for movies.
				</p>
			</main>
		);
	}

	return (
		<main className="mx-auto w-[min(1080px,100%-2rem)] space-y-6 py-8">
			<h1 className="text-2xl font-extrabold">Search</h1>
			<SearchBar key={q} defaultValue={q} />

			{isLoading ? (
				<SkeletonGrid />
			) : isError ? (
				<div className="flex items-center gap-3">
					<p className="text-sm text-muted-foreground">
						Failed to load search results.
					</p>
					<Button variant="outline" size="sm" onClick={() => refetch()}>
						Retry
					</Button>
				</div>
			) : (data?.results.length ?? 0) === 0 ? (
				<p className="text-sm text-muted-foreground">No results for "{q}".</p>
			) : (
				<div className={GRID_CLASS}>
					{data?.results.map((movie) => (
						<MovieCard key={movie.id} movie={movie} />
					))}
				</div>
			)}
		</main>
	);
}
