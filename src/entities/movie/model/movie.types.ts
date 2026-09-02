import type { ITmdbListResponse } from "@/shared/api/tmdb.types";

export interface IMovieApi {
	id: number;
	title: string;
	overview: string;
	poster_path: string | null;
	backdrop_path: string | null;
	release_date: string;
	vote_average: number;
	vote_count: number;
	popularity: number;
	genre_ids: number[];
}

export type TMovieApiListResponse = ITmdbListResponse<IMovieApi>;

export interface IMovieDetailsApi {
	id: number;
	title: string;
	overview: string;
	poster_path: string | null;
	backdrop_path: string | null;
	release_date: string;
	vote_average: number;
	vote_count: number;
	runtime: number;
	genres: Array<{ id: number; name: string }>;
}
