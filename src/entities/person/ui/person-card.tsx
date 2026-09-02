import { Fragment } from "react";
import { Link } from "@tanstack/react-router";
import { imageUrl } from "@/shared/lib/format";
import type { IPerson } from "../model/person-domain.types";

/**
 * Known-for titles inline: movie titles link to their detail page (the ids in
 * known_for are real TMDB ids); TV titles stay plain until a TV detail route
 * exists.
 */
function KnownForList({ person }: { person: IPerson }) {
	return (
		<p className="line-clamp-1 text-xs text-muted-foreground/70">
			Known for{" "}
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
			<div className="relative aspect-[2/3] overflow-hidden rounded-lg bg-muted ring-1 ring-border">
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
				{person.knownFor.length > 0 ? <KnownForList person={person} /> : null}
			</div>
		</article>
	);
}
