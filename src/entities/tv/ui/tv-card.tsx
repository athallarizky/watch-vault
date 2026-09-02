import { Badge } from "@/components/ui/badge";
import { formatRating, formatYear, imageUrl } from "@/shared/lib/format";
import { MediaTypeChip } from "@/shared/ui/media-type-chip";
import type { ITvShow } from "../model/tv-domain.types";

export function TvCard({ show }: { show: ITvShow }) {
	const poster = imageUrl(show.posterPath, "w185");

	return (
		<article>
			<div className="relative">
				{poster ? (
					<img
						src={poster}
						alt={show.name}
						width={185}
						height={278}
						loading="lazy"
						decoding="async"
						className="aspect-[2/3] w-full rounded-md object-cover"
					/>
				) : (
					<div className="flex aspect-[2/3] w-full items-center justify-center rounded-md bg-muted p-4 text-center text-sm text-muted-foreground">
						{show.name}
					</div>
				)}
				<MediaTypeChip type="TV" />
			</div>
			<div className="mt-2 space-y-1">
				<h3 className="line-clamp-1 text-sm font-semibold">{show.name}</h3>
				<div className="flex items-center justify-between gap-2">
					<span className="text-xs text-muted-foreground">
						{formatYear(show.firstAirDate)}
					</span>
					<Badge variant="secondary">★ {formatRating(show.voteAverage)}</Badge>
				</div>
			</div>
		</article>
	);
}
