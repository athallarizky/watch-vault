import { Badge } from "@/components/ui/badge";
import { formatRating, formatYear, imageUrl } from "@/shared/lib/format";
import type { IMovie } from "../model/movie-domain.types";

export function MovieCard({ movie }: { movie: IMovie }) {
	const poster = imageUrl(movie.posterPath, "w185");

	return (
		<article>
			<div>
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
			</div>
		</article>
	);
}
