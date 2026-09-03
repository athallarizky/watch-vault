import {
	type AgentToolResult,
	defineTool,
} from "@earendil-works/pi-coding-agent";
import { Type } from "typebox";
import type { IGenreListResponse } from "@/entities/genre/model/genre.types";
import type { TMovieApiListResponse } from "@/entities/movie/model/movie.types";
import { withoutBlockedMovies } from "./content-filter";
import { tmdbGet } from "./tmdb";

const MAX_RESULTS = 8;

function compactMovie(m: {
	id: number;
	title: string;
	release_date?: string;
	vote_average: number;
	genre_ids: number[];
}) {
	return {
		id: m.id,
		title: m.title,
		year: m.release_date ? m.release_date.slice(0, 4) : null,
		rating: m.vote_average,
		genre_ids: m.genre_ids,
	};
}

function movieListToText(list: TMovieApiListResponse): string {
	// Blocklisted ids never reach the agent, so it cannot recommend them.
	const items = withoutBlockedMovies(list.results).slice(0, MAX_RESULTS);
	if (items.length === 0) return "No results.";
	return JSON.stringify(items.map(compactMovie), null, 2);
}

function getError(error: unknown): AgentToolResult<undefined> {
	return {
		content: [
			{
				type: "text",
				text: `ERROR: ${error instanceof Error ? error.message : String(error)}`,
			},
		],
		details: undefined,
	};
}

export const searchMoviesTool = defineTool({
	name: "search_movies",
	label: "Search Movies",
	description:
		"Search TMDB movies by title or keyword. Use when the user asks for a specific title or keyword",
	parameters: Type.Object({
		query: Type.String({
			description: 'Search query, e.g. "blade runner"',
		}),
		year: Type.Optional(
			Type.Number({
				description: "Optional release year filter",
			}),
		),
	}),
	async execute(_toolCallId, params) {
		try {
			const data = await tmdbGet<TMovieApiListResponse>("/search/movie", {
				query: params.query,
				year: params.year,
			});

			return {
				content: [
					{
						type: "text",
						text: movieListToText(data),
					},
				],
				details: { count: data.results.length },
			};
		} catch (error) {
			return getError(error);
		}
	},
});

export const discoverMoviesTool = defineTool({
	name: "discover_movies",
	label: "Discover Movies",
	description:
		"Find movies using TMDB filters. Use when the user describes a mood, genre, era, or rating range.",
	parameters: Type.Object({
		with_genres: Type.Optional(
			Type.String({
				description: 'Comma-separated genre ids (AND), e.g. "878,9648"',
			}),
		),
		year: Type.Optional(
			Type.Number({
				description: "Release year",
			}),
		),
		"vote_average.gte": Type.Optional(
			Type.Number({
				description: "Minimum rating",
			}),
		),
		"vote_count.gte": Type.Optional(
			Type.Number({
				description: "Minimum vote count",
			}),
		),
		sort_by: Type.Optional(
			Type.String({
				description: 'Sort, e.g. "popularity.desc"',
			}),
		),
	}),
	async execute(_toolCallId, params) {
		try {
			const data = await tmdbGet<TMovieApiListResponse>(
				"/discover/movie",
				params as Record<string, string | number | undefined>,
			);

			return {
				content: [
					{
						type: "text",
						text: movieListToText(data),
					},
				],
				details: { count: data.results.length },
			};
		} catch (error) {
			return getError(error);
		}
	},
});

export const getSimilarMoviesTool = defineTool({
	name: "get_similar_movies",
	label: "Similar Movies",
	description:
		'Get movies similar to a given id. Use when the user wants titles "like" another movie.',
	parameters: Type.Object({
		movieId: Type.Number({
			description: "TMDB movie id",
		}),
	}),
	async execute(_toolCallId, params) {
		try {
			const data = await tmdbGet<TMovieApiListResponse>(
				`/movie/${params.movieId}/similar`,
			);
			return {
				content: [
					{
						type: "text",
						text: movieListToText(data),
					},
				],
				details: { count: data.results.length },
			};
		} catch (error) {
			return getError(error);
		}
	},
});

export const getMovieDetailsTool = defineTool({
	name: "get_movie_details",
	label: "Get Movie Details",
	description:
		"Get details (overview, genres, rating, year) for a movie id. Use to explain WHY a movie matches.",
	parameters: Type.Object({
		movieId: Type.Number({
			description: "TMDB movie id",
		}),
	}),
	async execute(_toolCallId, params) {
		try {
			const data = await tmdbGet<{
				id: number;
				title: string;
				overview: string;
				release_date: string;
				vote_average: number;
				genres: Array<{ id: number; name: string }>;
			}>(`/movie/${params.movieId}`);

			const text = JSON.stringify(
				{
					id: data.id,
					title: data.title,
					year: data.release_date?.slice(0, 4),
					rating: data.vote_average,
					genres: data.genres.map((g) => g.name),
					overview: data.overview?.slice(0, 400),
				},
				null,
				2,
			);

			return {
				content: [
					{
						type: "text",
						text,
					},
				],
				details: {
					id: data.id,
				},
			};
		} catch (error) {
			return getError(error);
		}
	},
});

export const getGenresTool = defineTool({
	name: "get_genres",
	label: "List Genres",
	description:
		"List TMDB genre ids and names. Use when you need to translate a genre name to an id for discover.",
	parameters: Type.Object({}),
	async execute() {
		try {
			const data = await tmdbGet<IGenreListResponse>("/genre/movie/list");
			const text = JSON.stringify(data.genres, null, 2);

			return {
				content: [
					{
						type: "text",
						text,
					},
				],
				details: { count: data.genres.length },
			};
		} catch (error) {
			return getError(error);
		}
	},
});

export const conciergeTools = [
	searchMoviesTool,
	discoverMoviesTool,
	getSimilarMoviesTool,
	getMovieDetailsTool,
	getGenresTool,
];
