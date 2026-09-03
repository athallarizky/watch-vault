import type { IMovieList } from "@/entities/movie/model/movie-domain.types";
import type { IPersonList } from "@/entities/person/model/person-domain.types";

/**
 * Manual content blocklist, configured via environment so the ids stay out
 * of the codebase:
 *
 *   BLOCKED_MOVIE_IDS="101,202,303"
 *   BLOCKED_PERSON_IDS="404,505"
 *
 * Applied at the server layer (list endpoints, credits, and the agent's
 * tool results) so every surface inherits it without UI changes.
 */
function parseIdSet(value: string | undefined): Set<number> {
	if (!value) return new Set<number>();
	return new Set(
		value
			.split(",")
			.map((part) => Number(part.trim()))
			.filter((id) => Number.isInteger(id) && id > 0),
	);
}

const blockedMovieIds = parseIdSet(process.env.BLOCKED_MOVIE_IDS);
const blockedPersonIds = parseIdSet(process.env.BLOCKED_PERSON_IDS);

export function isMovieBlocked(id: number): boolean {
	return blockedMovieIds.has(id);
}

export function withoutBlockedMovies<T extends { id: number }>(items: T[]): T[] {
	return items.filter((item) => !blockedMovieIds.has(item.id));
}

export function withoutBlockedPeople<T extends { id: number }>(items: T[]): T[] {
	return items.filter((item) => !blockedPersonIds.has(item.id));
}

export function filterMovieList(list: IMovieList): IMovieList {
	return { ...list, results: withoutBlockedMovies(list.results) };
}

export function filterPersonList(list: IPersonList): IPersonList {
	return {
		...list,
		results: withoutBlockedPeople(list.results).map((person) => ({
			...person,
			// Known-for entries reference movies by id; drop blocked ones too.
			knownFor: person.knownFor.filter(
				(entry) => !(entry.mediaType === "movie" && isMovieBlocked(entry.id)),
			),
		})),
	};
}

export function filterCredits<TCast extends { id: number }>(credits: {
	cast: TCast[];
}): { cast: TCast[] } {
	return { ...credits, cast: withoutBlockedPeople(credits.cast) };
}
