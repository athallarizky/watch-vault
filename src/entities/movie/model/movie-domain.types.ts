export interface IMovie {
	id: number;
	title: string;
	overview: string;
	posterPath: string | null;
	backdropPath: string | null;
	releaseDate: string;
	voteAverage: number;
	voteCount: number;
	popularity: number;
	genreIds: number[];
}

export interface IMovieList {
	page: number;
	results: IMovie[];
	totalPages: number;
	totalResults: number;
}

export interface IMovieDetails {
	id: number;
	title: string;
	overview: string;
	posterPath: string | null;
	backdropPath: string | null;
	releaseDate: string;
	voteAverage: number;
	voteCount: number;
	runtime: number;
	genreNames: string[];
}

/**
 * The subset of movie data that cards (and persisted collections like the
 * watchlist) actually consume. Both IMovie (list endpoints) and IMovieDetails
 * (detail endpoint) structurally satisfy it.
 *
 * Note: entries persisted before voteCount/overview were added will not have
 * them at runtime — card rendering treats them as optional for that reason.
 */
export type TMovieCardData = Pick<
	IMovie,
	| "id"
	| "title"
	| "posterPath"
	| "releaseDate"
	| "voteAverage"
	| "voteCount"
	| "overview"
>;

export interface IMovieCredit {
	id: number;
	name: string;
	character: string;
	profilePath: string | null;
}

export interface IMovieCredits {
	cast: IMovieCredit[];
}
