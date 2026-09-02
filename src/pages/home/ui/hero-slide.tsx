import { Link } from "@tanstack/react-router";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { IMovie } from "@/entities/movie/model/movie-domain.types";
import { formatYear, imageUrl } from "@/shared/lib/format";
import { RatingStar } from "@/shared/ui/rating-star";

interface IHeroSlideProps {
	movie: IMovie;
	/** First slide is the LCP element — load it eagerly with high priority. */
	priority: boolean;
}

export function HeroSlide({ movie, priority }: IHeroSlideProps) {
	const backdrop = imageUrl(movie.backdropPath, "w1280");

	return (
		<div className="relative h-[340px] overflow-hidden sm:h-[440px] lg:h-[520px]">
			{backdrop ? (
				<img
					src={backdrop}
					alt={movie.title}
					loading={priority ? "eager" : "lazy"}
					fetchPriority={priority ? "high" : "auto"}
					decoding="async"
					className="h-full w-full object-cover"
				/>
			) : (
				<div className="h-full w-full bg-card" />
			)}
			<div className="absolute inset-0 bg-gradient-to-t from-background via-background/55 to-background/10" />

			<div className="absolute bottom-0 left-0 max-w-2xl p-6 pb-8 lg:p-10 lg:pb-10">
				<h1 className="text-[36px] font-medium leading-[1.1] tracking-[-0.03em] md:text-display-xl lg:text-display-mega">
					{movie.title}
				</h1>
				<div className="mt-3 flex items-center gap-3">
					<span className="text-sm text-muted-foreground">
						{formatYear(movie.releaseDate)}
					</span>
					<Badge variant="secondary">
						<RatingStar vote={movie.voteAverage} voteCount={movie.voteCount} />
					</Badge>
				</div>
				<p className="mt-3 line-clamp-2 max-w-xl text-sm leading-relaxed text-muted-foreground">
					{movie.overview}
				</p>
				<div className="mt-5">
					<Button asChild>
						<Link to="/movies/$movieId" params={{ movieId: String(movie.id) }}>
							View Details
						</Link>
					</Button>
				</div>
			</div>
		</div>
	);
}
