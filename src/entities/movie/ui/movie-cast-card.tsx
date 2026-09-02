import { Link } from "@tanstack/react-router";
import { imageUrl } from "@/shared/lib/format";
import type { IMovieCredit } from "../model/movie-domain.types";

/** Top-billed cast member: profile, name, and the character they play. */
export function MovieCastCard({ credit }: { credit: IMovieCredit }) {
	const profile = imageUrl(credit.profilePath, "h632");

	return (
		<article>
			<Link
				to="/people/$personId"
				params={{ personId: String(credit.id) }}
				aria-label={`View profile for ${credit.name}`}
				className="group block rounded-lg focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
			>
				<div className="relative aspect-[2/3] overflow-hidden rounded-lg bg-muted ring-1 ring-border transition-all duration-200 group-hover:scale-[1.02] group-hover:shadow-xl group-hover:shadow-black/50 group-hover:ring-foreground/25 group-focus-within:scale-[1.02]">
					{profile ? (
						<img
							src={profile}
							alt={credit.name}
							loading="lazy"
							decoding="async"
							className="h-full w-full object-cover"
						/>
					) : (
						<div className="flex h-full w-full items-center justify-center p-3 text-center text-xs text-muted-foreground">
							{credit.name}
						</div>
					)}
				</div>
				<div className="mt-2 space-y-0.5">
					<h3 className="line-clamp-1 text-sm font-medium">{credit.name}</h3>
					{credit.character ? (
						<p className="line-clamp-1 text-xs text-muted-foreground">
							{credit.character}
						</p>
					) : null}
				</div>
			</Link>
		</article>
	);
}
