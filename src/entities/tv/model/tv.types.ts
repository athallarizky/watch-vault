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

export interface ITvShowDetailsApi {
	id: number;
	name: string;
	overview: string;
	poster_path: string | null;
	backdrop_path: string | null;
	first_air_date: string;
	vote_average: number;
	vote_count: number;
	/** Typical episode length candidates; TMDB returns several. */
	episode_run_time: number[];
	number_of_seasons: number;
	number_of_episodes: number;
	genres: Array<{ id: number; name: string }>;
}
