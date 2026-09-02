export interface IPerson {
	id: number;
	name: string;
	profilePath: string | null;
	knownForDepartment: string;
	popularity: number;
	knownFor: Array<{
		id: number;
		title?: string;
		name?: string;
		mediaType: string;
		posterPath: string | null;
	}>;
}

export interface IPersonList {
	page: number;
	results: IPerson[];
	totalPages: number;
	totalResults: number;
}

export interface IPersonDetails {
	id: number;
	name: string;
	biography: string;
	birthday: string | null;
	deathday: string | null;
	placeOfBirth: string | null;
	knownForDepartment: string;
	alsoKnownAs: string[];
	profilePath: string | null;
}

export interface IPersonCredit {
	id: number;
	mediaType: string;
	/** Resolved display title (movie title or show name). */
	title: string;
	character: string | null;
	job: string | null;
	posterPath: string | null;
	/** release_date or first_air_date, empty string when missing. */
	date: string;
	voteAverage: number;
	voteCount: number;
	episodesCount: number | null;
}

export interface IPersonCredits {
	cast: IPersonCredit[];
	crew: IPersonCredit[];
}
