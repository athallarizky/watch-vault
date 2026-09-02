import { formatYear, imageUrl } from "@/shared/lib/format";
import { MediaTypeChip } from "@/shared/ui/media-type-chip";
import { RatingStar } from "@/shared/ui/rating-star";
import type { ITvShow } from "../model/tv-domain.types";

export function TvCard({ show }: { show: ITvShow }) {
	const poster = imageUrl(show.posterPath, "w342");

	return (
		<article>
			<div className="relative aspect-[2/3] overflow-hidden rounded-lg bg-muted ring-1 ring-border">
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
				<MediaTypeChip type="TV" />
			</div>
			<div className="mt-2 space-y-0.5">
				<h3 className="line-clamp-1 text-sm font-medium">{show.name}</h3>
				<p className="flex items-center gap-1.5 text-xs text-muted-foreground">
					<span>{formatYear(show.firstAirDate)}</span>
					<span aria-hidden="true">·</span>
					<RatingStar vote={show.voteAverage} voteCount={show.voteCount} />
				</p>
			</div>
		</article>
	);
}
