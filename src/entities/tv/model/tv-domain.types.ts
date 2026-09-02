export interface ITvShow {
	id: number;
	name: string;
	overview: string;
	posterPath: string | null;
	backdropPath: string | null;
	firstAirDate: string;
	voteAverage: number;
	voteCount: number;
	popularity: number;
	genreIds: number[];
}

export interface ITvShowList {
	page: number;
	results: ITvShow[];
	totalPages: number;
	totalResults: number;
}
