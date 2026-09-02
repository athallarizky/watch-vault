import { defineTool } from "@earendil-works/pi-coding-agent";
import { Type } from "typebox";
import type { TMovieListResponse } from "@/entities/movie/model/movie.types";
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

function movieListToText(list: TMovieListResponse): string {
	const items = list.results.slice(0, MAX_RESULTS);
	if (items.length === 0) return "No results.";
	return JSON.stringify(items.map(compactMovie), null, 2);
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
	async execute(_toolCallid, params) {
		try {
			const data = await tmdbGet<TMovieListResponse>("/search/movie", {
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
	},
});
