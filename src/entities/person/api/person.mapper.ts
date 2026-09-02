import type {
	IPersonApi,
	IPersonCreditApi,
	IPersonDetailsApi,
	TPersonApiListResponse,
	TPersonCombinedCreditsApi,
} from "../model/person.types";
import type {
	IPerson,
	IPersonCredit,
	IPersonCredits,
	IPersonDetails,
	IPersonList,
} from "../model/person-domain.types";

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

export function mapPersonDetails(raw: IPersonDetailsApi): IPersonDetails {
	return {
		id: raw.id,
		name: raw.name,
		biography: raw.biography ?? "",
		birthday: raw.birthday,
		deathday: raw.deathday,
		placeOfBirth: raw.place_of_birth,
		knownForDepartment: raw.known_for_department,
		alsoKnownAs: raw.also_known_as ?? [],
		profilePath: raw.profile_path,
	};
}

function mapPersonCredit(raw: IPersonCreditApi): IPersonCredit {
	return {
		id: raw.id,
		mediaType: raw.media_type,
		title: raw.title ?? raw.name ?? "Untitled",
		character: raw.character ?? null,
		job: raw.job ?? null,
		posterPath: raw.poster_path,
		date: raw.release_date ?? raw.first_air_date ?? "",
		voteAverage: raw.vote_average,
		voteCount: raw.vote_count,
		episodesCount: raw.episode_count ?? null,
	};
}

export function mapPersonCredits(
	raw: TPersonCombinedCreditsApi,
): IPersonCredits {
	return {
		cast: (raw.cast ?? []).map(mapPersonCredit),
		crew: (raw.crew ?? []).map(mapPersonCredit),
	};
}
