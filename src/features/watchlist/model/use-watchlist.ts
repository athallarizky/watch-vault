import { useCallback, useEffect, useState } from "react";
import type { TMovieCardData } from "@/entities/movie/model/movie-domain.types";

const KEY = "watch-vault:watchlist";

function read(): TMovieCardData[] {
	if (typeof window === "undefined") return [];

	try {
		return JSON.parse(localStorage.getItem(KEY) ?? "[]") as TMovieCardData[];
	} catch {
		return [];
	}
}

export function useWatchList() {
	// Start empty so SSR and client hydration match, then fill from
	// localStorage after mount — client-only persisted state pattern.
	const [items, setItems] = useState<TMovieCardData[]>([]);

	useEffect(() => {
		setItems(read());
	}, []);

	const toggle = useCallback((movie: TMovieCardData) => {
		setItems((prev) => {
			const next = prev.some((m) => m.id === movie.id)
				? prev.filter((m) => m.id !== movie.id)
				: [...prev, movie];

			localStorage.setItem(KEY, JSON.stringify(next));
			return next;
		});
	}, []);

	const has = useCallback(
		(id: number) => items.some((m) => m.id === id),
		[items],
	);

	return { items, has, toggle };
}
