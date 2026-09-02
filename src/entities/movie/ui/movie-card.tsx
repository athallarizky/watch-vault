import { Link } from "@tanstack/react-router";
import { Badge } from "@/components/ui/badge";
import { formatRating, formatYear, imageUrl } from "@/shared/lib/format";
import { MediaTypeChip } from "@/shared/ui/media-type-chip";
import type { IMovie } from "../model/movie-domain.types";

export function MovieCard({ movie }: { movie: IMovie }) {
	const poster = imageUrl(movie.posterPath, "w185");

	return (
		<article>
			<Link
				to="/movies/$movieId"
				params={{ movieId: String(movie.id) }}
				aria-label={`View details for ${movie.title}`}
				className="block rounded-md focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
			>
				<div className="relative">
					{poster ? (
						<img
							src={poster}
							alt={movie.title}
							width={185}
							height={278}
							loading="lazy"
							decoding="async"
							className="aspect-[2/3] w-full rounded-md object-cover"
						/>
					) : (
						<div className="flex aspect-[2/3] w-full items-center justify-center rounded-md bg-muted p-4 text-center text-sm text-muted-foreground">
							{movie.title}
						</div>
					)}
					<MediaTypeChip type="Movie" />
				</div>
				<div className="mt-2 space-y-1">
					<h3 className="line-clamp-1 text-sm font-semibold">{movie.title}</h3>
					<div className="flex items-center justify-between gap-2">
						<span className="text-xs text-muted-foreground">
							{formatYear(movie.releaseDate)}
						</span>
						<Badge variant="secondary">
							★ {formatRating(movie.voteAverage)}
						</Badge>
					</div>
				</div>
			</Link>
		</article>
	);
}
