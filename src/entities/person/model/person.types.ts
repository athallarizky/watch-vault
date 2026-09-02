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
