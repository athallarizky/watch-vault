import { Link } from "@tanstack/react-router";
import { formatYear, imageUrl } from "@/shared/lib/format";
import { RatingStar } from "@/shared/ui/rating-star";
import type { TMovieCardData } from "../model/movie-domain.types";

export function MovieCard({ movie }: { movie: TMovieCardData }) {
	const poster = imageUrl(movie.posterPath, "w342");

	return (
		<article>
			<Link
				to="/movies/$movieId"
				params={{ movieId: String(movie.id) }}
				aria-label={`View details for ${movie.title}`}
				className="group block rounded-lg focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
			>
				<div className="relative aspect-[2/3] overflow-hidden rounded-lg bg-muted ring-1 ring-border transition-all duration-200 group-hover:scale-[1.02] group-hover:shadow-xl group-hover:shadow-black/50 group-hover:ring-foreground/25 group-focus-within:scale-[1.02]">
					{poster ? (
						<img
							src={poster}
							alt={movie.title}
							width={342}
							height={513}
							loading="lazy"
							decoding="async"
							className="h-full w-full object-cover"
						/>
					) : (
						<div className="flex h-full w-full items-center justify-center p-4 text-center text-sm text-muted-foreground">
							{movie.title}
						</div>
					)}
					{movie.overview ? (
						<div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-background via-background/85 to-transparent p-3 pt-10 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
							<p className="line-clamp-3 text-xs leading-snug text-foreground/90">
								{movie.overview}
							</p>
						</div>
					) : null}
				</div>
				<div className="mt-2 space-y-0.5">
					<h3 className="line-clamp-1 text-sm font-medium">{movie.title}</h3>
					<p className="flex items-center gap-1.5 text-xs text-muted-foreground">
						<span>{formatYear(movie.releaseDate)}</span>
						<span aria-hidden="true">·</span>
						<RatingStar vote={movie.voteAverage} voteCount={movie.voteCount} />
					</p>
				</div>
			</Link>
		</article>
	);
}
