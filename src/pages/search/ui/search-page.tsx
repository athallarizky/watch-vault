import { SearchX } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useSearchMovies } from "@/entities/movie/model/movie.queries";
import { MovieCard } from "@/entities/movie/ui/movie-card";
import { SearchBar } from "@/features/search";
import { Route } from "@/routes/search";

const GRID_CLASS =
	"grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6";

function SkeletonGrid() {
	return (
		<div className={GRID_CLASS}>
			{Array.from({ length: 12 }).map((_, i) => (
				// biome-ignore lint/suspicious/noArrayIndexKey: static placeholder list, never reordered
				<Skeleton key={i} className="aspect-[2/3] w-full rounded-lg" />
			))}
		</div>
	);
}

/** Composed empty state for the untouched search: what to do and why. */
function EmptyPrompt() {
	return (
		<div className="flex min-h-[50vh] flex-col items-center justify-center gap-4 py-16 text-center">
			<img
				src="/assets/search-empty.gif"
				alt=""
				aria-hidden="true"
				draggable={false}
				className="w-44 rounded-lg"
			/>
			<div className="space-y-1">
				<p className="text-lg font-medium">Find your next watch</p>
				<p className="text-sm text-muted-foreground">
					Search movies by title and jump straight to the details.
				</p>
			</div>
		</div>
	);
}

/** Composed no-results state: quote the query, suggest the next step. */
function NoResults({ query }: { query: string }) {
	return (
		<div className="flex min-h-[40vh] flex-col items-center justify-center gap-3 py-16 text-center">
			<SearchX aria-hidden="true" className="size-10 text-muted-foreground/40" />
			<div className="space-y-1">
				<p className="font-medium">No results for &quot;{query}&quot;</p>
				<p className="text-sm text-muted-foreground">
					Check the spelling or try a different title.
				</p>
			</div>
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
			<main className="mx-auto w-[min(1280px,100%-2rem)] space-y-6 py-8">
				<h1 className="text-display-md">Search</h1>
				<SearchBar defaultValue="" />
				<EmptyPrompt />
			</main>
		);
	}

	return (
		<main className="mx-auto w-[min(1280px,100%-2rem)] space-y-6 py-8">
			<h1 className="text-display-md">Search</h1>
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
				<NoResults query={q} />
			) : (
				<>
					<p className="text-sm text-muted-foreground">
						{data?.totalResults ?? data?.results.length} results for &quot;{q}
						&quot;
					</p>
					<div className={GRID_CLASS}>
						{data?.results.map((movie) => (
							<MovieCard key={movie.id} movie={movie} />
						))}
					</div>
				</>
			)}
		</main>
	);
}
