import { Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import type { IMovie } from "@/entities/movie/model/movie-domain.types";
import { imageUrl } from "@/shared/lib/format";

interface IHeroProps {
	movie: Pick<IMovie, "id" | "title" | "backdropPath">;
}

export const Hero = (props: IHeroProps) => {
	return (
		<section className="relative overflow-hidden rounded-xl">
			<img
				src={imageUrl(props.movie.backdropPath, "original") ?? ""}
				alt={props.movie.title}
				className="h-[420px] w-full object-cover"
				loading="eager"
				fetchPriority="high"
				decoding="async"
			/>
			<div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />
			<div className="absolute bottom-0 left-0 max-w-2xl p-6">
				<h1 className="text-3xl font-extrabold">{props.movie.title}</h1>
				<div className="mt-4 flex gap-3">
					<Button asChild>
						<Link
							to="/movies/$movieId"
							params={{ movieId: String(props.movie.id) }}
						>
							View Details
						</Link>
					</Button>
				</div>
			</div>
		</section>
	);
};
