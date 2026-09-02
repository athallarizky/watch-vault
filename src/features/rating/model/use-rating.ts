import { useCallback, useEffect, useState } from "react";

const KEY = "watch-vault:ratings";

type TRatingMap = Record<number, number>;

function read(): TRatingMap {
	if (typeof window === "undefined") return {};

	try {
		return JSON.parse(localStorage.getItem(KEY) ?? "{}") as TRatingMap;
	} catch {
		return {};
	}
}

export function useRating() {
	// Start empty so SSR and client hydration match, then fill from
	// localStorage after mount — client-only persisted state pattern.
	const [ratings, setRatings] = useState<TRatingMap>({});

	useEffect(() => {
		setRatings(read());
	}, []);

	const get = useCallback((id: number) => ratings[id], [ratings]);

	const set = useCallback((id: number, value: number) => {
		setRatings((prev) => {
			const next = { ...prev, [id]: value };
			localStorage.setItem(KEY, JSON.stringify(next));
			return next;
		});
	}, []);

	const remove = useCallback((id: number) => {
		setRatings((prev) => {
			const next = { ...prev };
			delete next[id];
			localStorage.setItem(KEY, JSON.stringify(next));
			return next;
		});
	}, []);

	return { ratings, get, set, remove };
}
