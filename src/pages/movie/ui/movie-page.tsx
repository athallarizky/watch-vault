import { useParams } from "@tanstack/react-router";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useMovieDetails } from "@/entities/movie/model/movie.queries";
import { AddToWatchlist } from "@/features/watchlist";
import { formatRating, formatYear, imageUrl } from "@/shared/lib/format";

export const MoviePage = () => {
	const { movieId } = useParams({ from: "/movies_/$movieId" });
	const { data, isLoading, isError, refetch } = useMovieDetails(
		Number(movieId),
	);

	if (isLoading) {
		return (
			<main className="mx-auto w-[min(1080px,100%-2rem)] space-y-4 py-8">
				<Skeleton className="h-[360px] w-full rounded-xl" />
				<Skeleton className="h-8 w-2/3" />
				<Skeleton className="h-4 w-1/2" />
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

	return (
		<main className="mx-auto w-[min(1080px,100%-2rem)] space-y-6 py-8">
			<section className="relative overflow-hidden rounded-xl">
				<img
					src={imageUrl(data.backdropPath, "w1280") ?? ""}
					alt={data.title}
					className="h-[360px] w-full object-cover"
				/>
				<div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />
			</section>

			<div className="flex flex-col gap-6 sm:flex-row">
				{imageUrl(data.posterPath, "w342") && (
					<img
						src={imageUrl(data.posterPath, "w342") ?? ""}
						alt={data.title}
						width={342}
						height={513}
						className="w-40 rounded-md object-cover"
					/>
				)}
				<div className="space-y-3">
					<h1 className="text-3xl font-extrabold">{data.title}</h1>
					<div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
						<span>{formatYear(data.releaseDate)}</span>
						<Badge variant="secondary">
							★ {formatRating(data.voteAverage)}
						</Badge>
						{data.runtime > 0 && <span>{data.runtime} min</span>}
						{data.genreNames.map((g) => (
							<Badge key={g} variant="outline">
								{g}
							</Badge>
						))}
					</div>
					<p className="max-w-2xl text-sm leading-relaxed">{data.overview}</p>
					<div className="flex gap-3 pt-2">
						<AddToWatchlist movie={data} />
						{/* TODO: wire rating action */}
						<Button disabled variant="outline" aria-label="Rate this movie">
							★ Rate
						</Button>
					</div>
				</div>
			</div>
		</main>
	);
};
