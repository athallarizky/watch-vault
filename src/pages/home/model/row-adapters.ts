import type { IMovie } from "@/entities/movie/model/movie-domain.types";
import type { ITvShow } from "@/entities/tv/model/tv-domain.types";
import { formatRating, formatYear } from "@/shared/lib/format";
import type { TRowItem } from "../ui/row";

// adapter: IMovie → IRowItem
export function movieToRowItem(
	m: Pick<
		IMovie,
		"id" | "title" | "releaseDate" | "voteAverage" | "backdropPath"
	>,
): TRowItem {
	return {
		id: m.id,
		title: m.title,
		year: formatYear(m.releaseDate),
		rating: formatRating(m.voteAverage),
		backdropPath: m.backdropPath,
	};
}

// adapter: ITvShow → IRowItem
export function tvToRowItem(
	t: Pick<
		ITvShow,
		"id" | "name" | "firstAirDate" | "voteAverage" | "backdropPath"
	>,
): TRowItem {
	return {
		id: t.id,
		title: t.name,
		year: formatYear(t.firstAirDate),
		rating: formatRating(t.voteAverage),
		backdropPath: t.backdropPath,
	};
}
