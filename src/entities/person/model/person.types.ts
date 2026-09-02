import type { ITmdbListResponse } from "@/shared/api/tmdb.types";

export interface IPersonApi {
	id: number;
	name: string;
	profile_path: string | null;
	known_for_department: string;
	popularity: number;
	known_for: Array<{
		id: number;
		title?: string;
		name?: string;
		media_type: string;
		poster_path: string | null;
	}>;
}

export type TPersonApiListResponse = ITmdbListResponse<IPersonApi>;

export interface IPersonDetailsApi {
	id: number;
	name: string;
	biography: string;
	birthday: string | null;
	deathday: string | null;
	place_of_birth: string | null;
	known_for_department: string;
	also_known_as: string[];
	profile_path: string | null;
}

/** One entry of /person/{id}/combined_credits (cast or crew side). */
export interface IPersonCreditApi {
	id: number;
	media_type: string;
	title?: string;
	name?: string;
	character?: string;
	job?: string;
	poster_path: string | null;
	release_date?: string;
	first_air_date?: string;
	vote_average: number;
	vote_count: number;
	episode_count?: number;
}

export interface TPersonCombinedCreditsApi {
	cast: IPersonCreditApi[];
	crew: IPersonCreditApi[];
}
