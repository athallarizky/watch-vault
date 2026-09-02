import type { IPersonApi, TPersonApiListResponse } from "../model/person.types";
import type { IPerson, IPersonList } from "../model/person-domain.types";

export function mapPerson(raw: IPersonApi): IPerson {
	return {
		id: raw.id,
		name: raw.name,
		profilePath: raw.profile_path,
		knownForDepartment: raw.known_for_department,
		popularity: raw.popularity,
		knownFor: (raw.known_for ?? []).map((kf) => ({
			id: kf.id,
			title: kf.title,
			name: kf.name,
			mediaType: kf.media_type,
			posterPath: kf.poster_path,
		})),
	};
}

export function mapPersonList(raw: TPersonApiListResponse): IPersonList {
	return {
		page: raw.page,
		results: raw.results.map(mapPerson),
		totalPages: raw.total_pages,
		totalResults: raw.total_results,
	};
}
