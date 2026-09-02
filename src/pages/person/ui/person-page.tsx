import { useParams } from "@tanstack/react-router";
import { useLayoutEffect, useRef, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
	usePersonCredits,
	usePersonDetails,
} from "@/entities/person/model/person.queries";
import type { IPersonCredit } from "@/entities/person/model/person-domain.types";
import { PersonCreditCard } from "@/entities/person/ui/person-credit-card";
import { formatDateShort, imageUrl } from "@/shared/lib/format";
import { BackButton } from "@/shared/ui/back-button";

const GRID_CLASS =
	"grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6";

function byVoteCountDesc(a: IPersonCredit, b: IPersonCredit): number {
	return b.voteCount - a.voteCount;
}

function byDateDesc(a: IPersonCredit, b: IPersonCredit): number {
	return b.date.localeCompare(a.date);
}

function personAge(birthday: string, deathday: string | null): number | null {
	const birthYear = Number(birthday.slice(0, 4));
	if (!birthYear) return null;
	const endYear = deathday ? Number(deathday.slice(0, 4)) : null;
	const reference = endYear ?? new Date().getFullYear();
	const age = reference - birthYear;
	return age >= 0 && age < 130 ? age : null;
}

/**
 * Biography with a smoothly animated clamp toggle. line-clamp itself cannot
 * transition, so the first paint renders a clamped probe to measure both
 * heights (offsetHeight vs scrollHeight); the animated mode then transitions
 * max-height between them inside an overflow-hidden wrapper.
 */
function Biography({ text }: { text: string }) {
	const [expanded, setExpanded] = useState(false);
	const [heights, setHeights] = useState<{
		collapsed: number;
		full: number;
	} | null>(null);
	const probeRef = useRef<HTMLParagraphElement>(null);

	useLayoutEffect(() => {
		const el = probeRef.current;
		if (!el || heights) return;
		setHeights({ collapsed: el.offsetHeight, full: el.scrollHeight });
	}, [heights]);

	if (!text) {
		return <p className="text-sm text-muted-foreground">No biography yet.</p>;
	}

	if (!heights) {
		return (
			<p
				ref={probeRef}
				className="max-w-3xl text-sm leading-relaxed whitespace-pre-line text-muted-foreground line-clamp-4"
			>
				{text}
			</p>
		);
	}

	const isLong = heights.full - heights.collapsed > 8;

	return (
		<div className="space-y-2">
			<div
				className="overflow-hidden transition-[max-height] duration-300 ease-in-out motion-reduce:transition-none"
				style={{ maxHeight: expanded ? heights.full + 8 : heights.collapsed }}
			>
				<p className="max-w-3xl text-sm leading-relaxed whitespace-pre-line text-muted-foreground">
					{text}
				</p>
			</div>
			{isLong ? (
				<Button
					variant="link"
					size="sm"
					className="px-0"
					aria-expanded={expanded}
					onClick={() => setExpanded((value) => !value)}
				>
					{expanded ? "Show less" : "Read more"}
				</Button>
			) : null}
		</div>
	);
}

export const PersonPage = () => {
	const { personId } = useParams({ from: "/people_/$personId" });
	const details = usePersonDetails(Number(personId));
	const credits = usePersonCredits(Number(personId));

	if (details.isLoading) {
		return (
			<main className="mx-auto w-[min(1280px,100%-2rem)] space-y-8 py-8">
				<div className="flex flex-col gap-6 sm:flex-row">
					<Skeleton className="aspect-[2/3] w-full rounded-lg sm:w-48" />
					<div className="flex-1 space-y-3">
						<Skeleton className="h-10 w-2/3" />
						<Skeleton className="h-4 w-1/3" />
						<Skeleton className="h-4 w-full" />
						<Skeleton className="h-4 w-full" />
					</div>
				</div>
				<Skeleton className="h-6 w-40" />
				<div className={GRID_CLASS}>
					{Array.from({ length: 6 }).map((_, i) => (
						// biome-ignore lint/suspicious/noArrayIndexKey: static placeholder (never rerender)
						<Skeleton key={i} className="aspect-[2/3] w-full rounded-lg" />
					))}
				</div>
			</main>
		);
	}

	if (details.isError || !details.data) {
		return (
			<main className="mx-auto w-[min(1280px,100%-2rem)] py-8">
				<p className="mb-3 text-sm text-muted-foreground">
					Failed to load this profile.
				</p>
				<Button variant="outline" onClick={() => details.refetch()}>
					Retry
				</Button>
			</main>
		);
	}

	const person = details.data;
	const profile = imageUrl(person.profilePath, "h632");
	// Directors and writers may have no cast entries — crew is their filmography.
	const roles =
		(credits.data?.cast.length ? credits.data.cast : credits.data?.crew) ?? [];
	const knownFor = roles
		.filter((credit) => credit.posterPath)
		.sort(byVoteCountDesc)
		.slice(0, 10);
	const filmography = [...roles].sort(byDateDesc);
	const age = person.birthday
		? personAge(person.birthday, person.deathday)
		: null;

	return (
		<main className="mx-auto w-[min(1280px,100%-2rem)] space-y-10 py-8">
			<BackButton fallback={{ to: "/discover", search: { tab: "people" } }} />
			<section
				aria-label={`${person.name} profile`}
				className="flex flex-col gap-6 sm:flex-row"
			>
				<div className="aspect-[2/3] w-full shrink-0 overflow-hidden rounded-lg bg-muted ring-1 ring-border sm:w-48">
					{profile ? (
						<img
							src={profile}
							alt={person.name}
							className="h-full w-full object-cover"
						/>
					) : (
						<div className="flex h-full items-center justify-center p-4 text-center text-sm text-muted-foreground">
							{person.name}
						</div>
					)}
				</div>

				<div className="min-w-0 flex-1 space-y-3">
					<div className="space-y-2">
						<h1 className="text-display-md">{person.name}</h1>
						<Badge variant="outline">{person.knownForDepartment}</Badge>
					</div>

					<div className="space-y-1 text-sm text-muted-foreground">
						{person.birthday ? (
							<p>
								{person.deathday
									? `${formatDateShort(person.birthday)} - ${formatDateShort(person.deathday)}`
									: `${formatDateShort(person.birthday)}${age !== null ? ` (${age} years old)` : ""}`}
							</p>
						) : null}
						{person.placeOfBirth ? <p>{person.placeOfBirth}</p> : null}
						<p>{roles.length} credits</p>
					</div>

					<Biography text={person.biography} />
				</div>
			</section>

			{knownFor.length > 0 ? (
				<section aria-label="Popular titles" className="space-y-4">
					<h2 className="text-display-sm">Popular Titles</h2>
					<div className={GRID_CLASS}>
						{knownFor.map((credit) => (
							<PersonCreditCard
								key={`${credit.mediaType}-${credit.id}`}
								credit={credit}
							/>
						))}
					</div>
				</section>
			) : null}

			{filmography.length > 0 ? (
				<section aria-label="Credits" className="space-y-4">
					<h2 className="text-display-sm">Credits</h2>
					<div className={GRID_CLASS}>
						{filmography.map((credit) => (
							<PersonCreditCard
								key={`${credit.mediaType}-${credit.id}-credit`}
								credit={credit}
							/>
						))}
					</div>
				</section>
			) : null}
		</main>
	);
};
