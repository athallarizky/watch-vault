import { useParams } from "@tanstack/react-router";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
	useMovieCredits,
	useMovieDetails,
} from "@/entities/movie/model/movie.queries";
import { MovieCastCard } from "@/entities/movie/ui/movie-cast-card";
import { RateMovie } from "@/features/rating";
import { AddToWatchlist } from "@/features/watchlist";
import { formatYear, imageUrl } from "@/shared/lib/format";
import { BackButton } from "@/shared/ui/back-button";
import { RatingStar } from "@/shared/ui/rating-star";

const CAST_GRID_CLASS =
	"grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6";
const CAST_LIMIT = 12;

export const MoviePage = () => {
	const { movieId } = useParams({ from: "/movies_/$movieId" });
	const { data, isLoading, isError, refetch } = useMovieDetails(
		Number(movieId),
	);
	const credits = useMovieCredits(Number(movieId));

	if (isLoading) {
		return (
			<main className="mx-auto w-[min(1080px,100%-2rem)] space-y-6 py-8">
				<Skeleton className="h-[360px] w-full rounded-xl" />
				<div className="flex flex-col gap-6 sm:flex-row">
					<Skeleton className="aspect-[2/3] w-full rounded-lg sm:w-40" />
					<div className="flex-1 space-y-3">
						<Skeleton className="h-10 w-2/3" />
						<Skeleton className="h-4 w-1/2" />
						<Skeleton className="h-4 w-full" />
					</div>
				</div>
			</main>
		);
	}

	if (isError || !data) {
		return (
			<main className="mx-auto w-[min(1080px,100%-2rem)] py-8">
				<p className="mb-3 text-sm text-muted-foreground">
					Failed to load movie details.
				</p>
				<Button variant="outline" onClick={() => refetch()}>
					Retry
				</Button>
			</main>
		);
	}

	const cast = credits.data?.cast.slice(0, CAST_LIMIT) ?? [];

	return (
		<main className="mx-auto w-[min(1080px,100%-2rem)] space-y-6 py-8">
			<BackButton fallback={{ to: "/discover", search: { tab: "popular" } }} />

			<section className="relative overflow-hidden rounded-xl">
				<img
					src={imageUrl(data.backdropPath, "w1280") ?? ""}
					alt={data.title}
					loading="eager"
					className="h-[360px] w-full object-cover"
				/>
				<div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />
			</section>

			<section className="flex flex-col gap-6 sm:flex-row">
				<div className="aspect-[2/3] w-full shrink-0 overflow-hidden rounded-lg bg-muted ring-1 ring-border sm:w-40">
					{imageUrl(data.posterPath, "w342") ? (
						<img
							src={imageUrl(data.posterPath, "w342") ?? ""}
							alt={data.title}
							width={342}
							height={513}
							className="h-full w-full object-cover"
						/>
					) : (
						<div className="flex h-full items-center justify-center p-4 text-center text-sm text-muted-foreground">
							{data.title}
						</div>
					)}
				</div>

				<div className="min-w-0 flex-1 space-y-3">
					<h1 className="text-display-md">{data.title}</h1>
					<div className="flex flex-wrap items-center gap-x-3 gap-y-2 text-sm text-muted-foreground">
						<span>{formatYear(data.releaseDate)}</span>
						<RatingStar vote={data.voteAverage} voteCount={data.voteCount} />
						{data.runtime > 0 && <span>{data.runtime} min</span>}
					</div>
					{data.genreNames.length > 0 ? (
						<div className="flex flex-wrap gap-2">
							{data.genreNames.map((genre) => (
								<Badge key={genre} variant="outline">
									{genre}
								</Badge>
							))}
						</div>
					) : null}
					<p className="max-w-2xl text-sm leading-relaxed text-muted-foreground">
						{data.overview || "No overview yet."}
					</p>
					<div className="flex items-center gap-4 pt-2">
						<AddToWatchlist movie={data} />
						<RateMovie movieId={data.id} />
					</div>
				</div>
			</section>

			{credits.isLoading ? (
				<section aria-label="Cast" className="space-y-4">
					<h2 className="text-display-sm">Top Billed Cast</h2>
					<div className={CAST_GRID_CLASS}>
						{Array.from({ length: 6 }).map((_, i) => (
							// biome-ignore lint/suspicious/noArrayIndexKey: static placeholder (never rerender)
							<Skeleton key={i} className="aspect-[2/3] w-full rounded-lg" />
						))}
					</div>
				</section>
			) : cast.length > 0 ? (
				<section aria-label="Cast" className="space-y-4">
					<h2 className="text-display-sm">Top Billed Cast</h2>
					<div className={CAST_GRID_CLASS}>
						{cast.map((member) => (
							<MovieCastCard key={member.id} credit={member} />
						))}
					</div>
				</section>
			) : null}
		</main>
	);
};
