import type { IMovie } from "@/entities/movie/model/movie-domain.types";
import type { ITvShow } from "@/entities/tv/model/tv-domain.types";
import { formatDateShort, formatYear } from "@/shared/lib/format";
import type { TRowItem } from "../ui/row";

type TMovieRowSource = Pick<
	IMovie,
	| "id"
	| "title"
	| "releaseDate"
	| "voteAverage"
	| "voteCount"
	| "overview"
	| "posterPath"
>;

// adapter: IMovie → TRowItem
export function movieToRowItem(m: TMovieRowSource): TRowItem {
	return {
		id: m.id,
		title: m.title,
		year: formatYear(m.releaseDate),
		voteAverage: m.voteAverage,
		voteCount: m.voteCount,
		overview: m.overview,
		posterPath: m.posterPath,
	};
}

// adapter for unreleased titles — the exact date matters more than the year.
export function upcomingMovieToRowItem(m: TMovieRowSource): TRowItem {
	return {
		...movieToRowItem(m),
		year: formatDateShort(m.releaseDate),
	};
}

// adapter: ITvShow → TRowItem
export function tvToRowItem(
	t: Pick<
		ITvShow,
		| "id"
		| "name"
		| "firstAirDate"
		| "voteAverage"
		| "voteCount"
		| "overview"
		| "posterPath"
	>,
): TRowItem {
	return {
		id: t.id,
		title: t.name,
		year: formatYear(t.firstAirDate),
		voteAverage: t.voteAverage,
		voteCount: t.voteCount,
		overview: t.overview,
		posterPath: t.posterPath,
	};
}
