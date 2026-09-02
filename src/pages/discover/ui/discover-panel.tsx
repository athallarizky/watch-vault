import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import type { IMovieList } from "@/entities/movie/model/movie-domain.types";
import { MovieCard } from "@/entities/movie/ui/movie-card";
import type { ITvShowList } from "@/entities/tv/model/tv-domain.types";
import { TvCard } from "@/entities/tv/ui/tv-card";
import type { TDiscoverData } from "../model/discover-tabs";

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

interface IDiscoverPanelProps {
	kind: "movie" | "tv";
	data: TDiscoverData | undefined;
	isLoading: boolean;
	isError: boolean;
	onRetry: () => void;
}

export function DiscoverPanel({
	kind,
	data,
	isLoading,
	isError,
	onRetry,
}: IDiscoverPanelProps) {
	if (isLoading) return <SkeletonGrid />;
	if (isError)
		return (
			<div className="flex items-center gap-3">
				<p className="text-sm text-muted-foreground">Failed to load titles.</p>
				<Button variant="outline" size="sm" onClick={onRetry}>
					Retry
				</Button>
			</div>
		);
	if (!data || data.results.length === 0)
		return <p className="text-sm text-muted-foreground">No titles found.</p>;

	return (
		<div className={GRID_CLASS}>
			{kind === "movie"
				? (data as IMovieList).results.map((movie) => (
						<MovieCard key={movie.id} movie={movie} />
					))
				: (data as ITvShowList).results.map((show) => (
						<TvCard key={show.id} show={show} />
					))}
		</div>
	);
}
