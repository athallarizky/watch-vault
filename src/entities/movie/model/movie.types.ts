import type { ITmdbListResponse } from "@/shared/api/tmdb.types";

export interface IMovie {
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

export type TMovieListResponse = ITmdbListResponse<IMovie>;
