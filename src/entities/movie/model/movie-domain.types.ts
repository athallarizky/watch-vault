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
	runtime: number;
	genreNames: string[];
}
