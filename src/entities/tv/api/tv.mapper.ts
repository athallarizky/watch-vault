import type { ITvShowApi, TTvApiListResponse } from "../model/tv.types";
import type { ITvShow, ITvShowList } from "../model/tv-domain.types";

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
