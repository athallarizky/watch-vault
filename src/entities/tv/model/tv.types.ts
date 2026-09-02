import type { ITmdbListResponse } from "@/shared/api/tmdb.types";

export interface ITvShowApi {
	id: number;
	name: string;
	overview: string;
	poster_path: string | null;
	backdrop_path: string | null;
	first_air_date: string;
	vote_average: number;
	vote_count: number;
	popularity: number;
	genre_ids: number[];
}

export type TTvApiListResponse = ITmdbListResponse<ITvShowApi>;
