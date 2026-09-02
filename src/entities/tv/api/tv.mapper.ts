import type {
	ITvShowApi,
	ITvShowDetailsApi,
	TTvApiListResponse,
	TTvCreditsApi,
} from "../model/tv.types";
import type {
	ITvShow,
	ITvShowDetails,
	ITvShowList,
	ITvCredits,
} from "../model/tv-domain.types";

export function mapTvShow(raw: ITvShowApi): ITvShow {
	return {
		id: raw.id,
		name: raw.name,
		overview: raw.overview,
		posterPath: raw.poster_path,
		backdropPath: raw.backdrop_path,
		firstAirDate: raw.first_air_date,
		voteAverage: raw.vote_average,
		voteCount: raw.vote_count,
		popularity: raw.popularity,
		genreIds: raw.genre_ids,
	};
}

export function mapTvShowList(raw: TTvApiListResponse): ITvShowList {
	return {
		page: raw.page,
		results: raw.results.map(mapTvShow),
		totalPages: raw.total_pages,
		totalResults: raw.total_results,
	};
}

export function mapTvShowDetails(raw: ITvShowDetailsApi): ITvShowDetails {
	return {
		id: raw.id,
		name: raw.name,
		overview: raw.overview,
		posterPath: raw.poster_path,
		backdropPath: raw.backdrop_path,
		firstAirDate: raw.first_air_date,
		voteAverage: raw.vote_average,
		voteCount: raw.vote_count,
		episodeRunTime: raw.episode_run_time ?? [],
		numberOfSeasons: raw.number_of_seasons,
		numberOfEpisodes: raw.number_of_episodes,
		genreNames: (raw.genres ?? []).map((g) => g.name),
	};
}

export function mapTvCredits(raw: TTvCreditsApi): ITvCredits {
	return {
		cast: (raw.cast ?? []).map((member) => ({
			id: member.id,
			name: member.name,
			character: member.character ?? "",
			profilePath: member.profile_path,
		})),
	};
}
