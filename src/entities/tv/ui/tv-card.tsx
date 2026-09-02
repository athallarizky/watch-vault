import { Link } from "@tanstack/react-router";
import { formatYear, imageUrl } from "@/shared/lib/format";
import { RatingStar } from "@/shared/ui/rating-star";
import type { ITvShow } from "../model/tv-domain.types";

export function TvCard({ show }: { show: ITvShow }) {
	const poster = imageUrl(show.posterPath, "w342");

	return (
		<article>
			<Link
				to="/tv/$tvId"
				params={{ tvId: String(show.id) }}
				aria-label={`View details for ${show.name}`}
				className="group block rounded-lg focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
			>
				<div className="relative aspect-[2/3] overflow-hidden rounded-lg bg-muted ring-1 ring-border transition-all duration-200 group-hover:scale-[1.02] group-hover:shadow-xl group-hover:shadow-black/50 group-hover:ring-foreground/25 group-focus-within:scale-[1.02]">
					{poster ? (
						<img
							src={poster}
							alt={show.name}
							width={342}
							height={513}
							loading="lazy"
							decoding="async"
							className="h-full w-full object-cover"
						/>
					) : (
						<div className="flex h-full w-full items-center justify-center p-4 text-center text-sm text-muted-foreground">
							{show.name}
						</div>
					)}
					{show.overview ? (
						<div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-background via-background/85 to-transparent p-3 pt-10 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
							<p className="line-clamp-3 text-xs leading-snug text-foreground/90">
								{show.overview}
							</p>
						</div>
					) : null}
				</div>
				<div className="mt-2 space-y-0.5">
					<h3 className="line-clamp-1 text-sm font-medium">{show.name}</h3>
					<p className="flex items-center gap-1.5 text-xs text-muted-foreground">
						<span>{formatYear(show.firstAirDate)}</span>
						<span aria-hidden="true">·</span>
						<RatingStar vote={show.voteAverage} voteCount={show.voteCount} />
					</p>
				</div>
			</Link>
		</article>
	);
}
