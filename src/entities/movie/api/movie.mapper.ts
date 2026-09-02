import type {
	IMovieApi,
	IMovieDetailsApi,
	TMovieApiListResponse,
} from "../model/movie.types";
import type {
	IMovie,
	IMovieDetails,
	IMovieList,
} from "../model/movie-domain.types";

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

export function mapMovieDetails(raw: IMovieDetailsApi): IMovieDetails {
	return {
		id: raw.id,
		title: raw.title,
		overview: raw.overview,
		posterPath: raw.poster_path,
		backdropPath: raw.backdrop_path,
		releaseDate: raw.release_date,
		voteAverage: raw.vote_average,
		voteCount: raw.vote_count,
		runtime: raw.runtime,
		genreNames: raw.genres.map((g) => g.name),
	};
}
