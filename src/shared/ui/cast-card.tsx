import { Link } from "@tanstack/react-router";
import { imageUrl } from "@/shared/lib/format";

/** Structural shape both movie and tv credit mappers produce. */
export interface ICastMember {
	id: number;
	name: string;
	character: string;
	profilePath: string | null;
}

/** Top-billed cast member: profile, name, and the character they play. */
export function CastCard({ member }: { member: ICastMember }) {
	const profile = imageUrl(member.profilePath, "h632");

	return (
		<article>
			<Link
				to="/people/$personId"
				params={{ personId: String(member.id) }}
				aria-label={`View profile for ${member.name}`}
				className="group block rounded-lg focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
			>
				<div className="relative aspect-[2/3] overflow-hidden rounded-lg bg-muted ring-1 ring-border transition-all duration-200 group-hover:scale-[1.02] group-hover:shadow-xl group-hover:shadow-black/50 group-hover:ring-foreground/25 group-focus-within:scale-[1.02]">
					{profile ? (
						<img
							src={profile}
							alt={member.name}
							loading="lazy"
							decoding="async"
							className="h-full w-full object-cover"
						/>
					) : (
						<div className="flex h-full w-full items-center justify-center p-3 text-center text-xs text-muted-foreground">
							{member.name}
						</div>
					)}
				</div>
				<div className="mt-2 space-y-0.5">
					<h3 className="line-clamp-1 text-sm font-medium">{member.name}</h3>
					{member.character ? (
						<p className="line-clamp-1 text-xs text-muted-foreground">
							{member.character}
						</p>
					) : null}
				</div>
			</Link>
		</article>
	);
}
