import { useParams } from "@tanstack/react-router";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useTvDetails } from "@/entities/tv/model/tv.queries";
import { formatYear, imageUrl } from "@/shared/lib/format";
import { BackButton } from "@/shared/ui/back-button";
import { RatingStar } from "@/shared/ui/rating-star";

export const TvPage = () => {
	const { tvId } = useParams({ from: "/tv_/$tvId" });
	const { data, isLoading, isError, refetch } = useTvDetails(Number(tvId));

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
					Failed to load this series.
				</p>
				<Button variant="outline" onClick={() => refetch()}>
					Retry
				</Button>
			</main>
		);
	}

	const runtime = data.episodeRunTime[0] ?? 0;

	return (
		<main className="mx-auto w-[min(1080px,100%-2rem)] space-y-6 py-8">
			<BackButton
				fallback={{ to: "/discover", search: { tab: "tv-popular" } }}
			/>

			<section className="relative overflow-hidden rounded-xl">
				<img
					src={imageUrl(data.backdropPath, "w1280") ?? ""}
					alt={data.name}
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
							alt={data.name}
							width={342}
							height={513}
							className="h-full w-full object-cover"
						/>
					) : (
						<div className="flex h-full items-center justify-center p-4 text-center text-sm text-muted-foreground">
							{data.name}
						</div>
					)}
				</div>

				<div className="min-w-0 flex-1 space-y-3">
					<h1 className="text-display-md">{data.name}</h1>
					<div className="flex flex-wrap items-center gap-x-3 gap-y-2 text-sm text-muted-foreground">
						<span>{formatYear(data.firstAirDate)}</span>
						<RatingStar vote={data.voteAverage} voteCount={data.voteCount} />
						{runtime > 0 && <span>{runtime} min/ep</span>}
						{data.numberOfSeasons > 0 && (
							<span>
								{data.numberOfSeasons} season
								{data.numberOfSeasons > 1 ? "s" : ""}
							</span>
						)}
						{data.numberOfEpisodes > 0 && (
							<span>{data.numberOfEpisodes} episodes</span>
						)}
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
				</div>
			</section>
		</main>
	);
};
