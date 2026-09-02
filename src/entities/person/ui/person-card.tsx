import { Fragment } from "react";
import { Link } from "@tanstack/react-router";
import { imageUrl } from "@/shared/lib/format";
import type { IPerson } from "../model/person-domain.types";

/**
 * Known-for titles as a bare credits line (no sentence prefix): movie titles
 * link to their detail page (the ids in known_for are real TMDB ids); TV
 * titles stay plain until a TV detail route exists. Kept outside the profile
 * link to avoid nested anchors.
 */
function KnownForList({ person }: { person: IPerson }) {
	return (
		<p className="line-clamp-1 text-xs text-muted-foreground/70">
			{person.knownFor.map((kf, index) => {
				const title = kf.title ?? kf.name;
				if (!title) return null;
				return (
					<Fragment key={`${kf.mediaType}-${kf.id}`}>
						{index > 0 ? ", " : null}
						{kf.mediaType === "movie" ? (
							<Link
								to="/movies/$movieId"
								params={{ movieId: String(kf.id) }}
								className="rounded-sm underline-offset-2 transition-colors hover:text-foreground hover:underline focus-visible:outline-2 focus-visible:outline-ring"
							>
								{title}
							</Link>
						) : (
							title
						)}
					</Fragment>
				);
			})}
		</p>
	);
}

export function PersonCard({ person }: { person: IPerson }) {
	const profile = imageUrl(person.profilePath, "h632");

	return (
		<article>
			<Link
				to="/people/$personId"
				params={{ personId: String(person.id) }}
				aria-label={`View profile for ${person.name}`}
				className="group block rounded-lg focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
			>
				<div className="relative aspect-[2/3] overflow-hidden rounded-lg bg-muted ring-1 ring-border transition-all duration-200 group-hover:scale-[1.02] group-hover:shadow-xl group-hover:shadow-black/50 group-hover:ring-foreground/25 group-focus-within:scale-[1.02]">
					{profile ? (
						<img
							src={profile}
							alt={person.name}
							loading="lazy"
							decoding="async"
							className="h-full w-full object-cover"
						/>
					) : (
						<div className="flex h-full w-full items-center justify-center p-4 text-center text-sm text-muted-foreground">
							{person.name}
						</div>
					)}
				</div>
				<div className="mt-2 space-y-0.5">
					<h3 className="line-clamp-1 text-sm font-medium">{person.name}</h3>
					<p className="text-xs text-muted-foreground">
						{person.knownForDepartment}
					</p>
				</div>
			</Link>
			{person.knownFor.length > 0 ? (
				<div className="mt-0.5">
					<KnownForList person={person} />
				</div>
			) : null}
		</article>
	);
}
