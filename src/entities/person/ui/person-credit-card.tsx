import { Link } from "@tanstack/react-router";
import { formatYear, imageUrl } from "@/shared/lib/format";
import { RatingStar } from "@/shared/ui/rating-star";
import type { IPersonCredit } from "../model/person-domain.types";

interface IPersonCreditCardProps {
	credit: IPersonCredit;
}

/**
 * One filmography entry: poster, title, and the person's role on it
 * (character for cast, job for crew). Movie entries link to their detail
 * page; TV entries render plain until a TV detail route exists.
 */
export function PersonCreditCard({ credit }: IPersonCreditCardProps) {
	const poster = imageUrl(credit.posterPath, "w342");
	const role = credit.character ?? credit.job ?? "";

	const body = (
		<>
			<div className="relative aspect-[2/3] overflow-hidden rounded-lg bg-muted ring-1 ring-border transition-all duration-200 group-hover:scale-[1.02] group-hover:shadow-xl group-hover:shadow-black/50 group-hover:ring-foreground/25 group-focus-within:scale-[1.02]">
				{poster ? (
					<img
						src={poster}
						alt={credit.title}
						width={342}
						height={513}
						loading="lazy"
						decoding="async"
						className="h-full w-full object-cover"
					/>
				) : (
					<div className="flex h-full w-full items-center justify-center p-3 text-center text-xs text-muted-foreground">
						{credit.title}
					</div>
				)}
			</div>
			<div className="mt-2 space-y-0.5">
				<h3 className="line-clamp-1 text-sm font-medium">{credit.title}</h3>
				<p className="line-clamp-1 text-xs text-muted-foreground">
					{credit.date ? formatYear(credit.date) : ""}
					{role ? ` · ${role}` : ""}
					{credit.mediaType === "tv" && credit.episodesCount ? (
						<> · {credit.episodesCount} eps</>
					) : null}
				</p>
				<p className="flex items-center gap-1.5 text-xs text-muted-foreground">
					<RatingStar vote={credit.voteAverage} voteCount={credit.voteCount} />
				</p>
			</div>
		</>
	);

	if (credit.mediaType === "movie") {
		return (
			<article>
				<Link
					to="/movies/$movieId"
					params={{ movieId: String(credit.id) }}
					aria-label={`View details for ${credit.title}`}
					className="group block rounded-lg focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
				>
					{body}
				</Link>
			</article>
		);
	}

	return <article>{body}</article>;
}
