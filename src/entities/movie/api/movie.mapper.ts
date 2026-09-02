import type { IMovieApi, TMovieApiListResponse } from "../model/movie.types";
import type { IMovie, IMovieList } from "../model/movie-domain.types";

export function mapMovie(raw: IMovieApi): IMovie {
	return {
		id: raw.id,
		title: raw.title,
		overview: raw.overview,
		posterPath: raw.poster_path,
		backdropPath: raw.backdrop_path,
		releaseDate: raw.release_date,
		voteAverage: raw.vote_average,
		voteCount: raw.vote_count,
		popularity: raw.popularity,
		genreIds: raw.genre_ids,
	};
}

export function mapMovieList(raw: TMovieApiListResponse): IMovieList {
	return {
		page: raw.page,
		results: raw.results.map(mapMovie),
		totalPages: raw.total_pages,
		totalResults: raw.total_results,
	};
}
