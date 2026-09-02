const IMAGE_BASE =
	import.meta.env.VITE_TMDB_IMAGE_BASE_URL ?? "https://image.tmdb.org/t/p";

// Official size TMDB v3: poster w92/w154/w185/w342/w500/w780/original,
// profile w45/w185/h632, backdrop w300/w780/w1280.
export function imageUrl(
	path: string | null,
	size:
		| "w45"
		| "w92"
		| "w154"
		| "w185"
		| "w300"
		| "w342"
		| "w500"
		| "w780"
		| "w1280"
		| "h632"
		| "original" = "w185",
): string | null {
	return path ? `${IMAGE_BASE}/${size}${path}` : null;
}

export function formatYear(date: string): string {
	return date ? date.slice(0, 4) : "-";
}

export function formatRating(vote: number): string {
	return vote > 0 ? vote.toFixed(1) : "-";
}

// Compact trust signal for ratings: 940 -> "940", 1240 -> "1.2k", 12400 -> "12k".
export function formatVoteCount(count: number): string {
	if (count >= 1000) {
		const k = count / 1000;
		return `${k >= 10 ? Math.round(k) : k.toFixed(1)}k`;
	}
	return String(count);
}

const MONTHS_SHORT = [
	"Jan",
	"Feb",
	"Mar",
	"Apr",
	"May",
	"Jun",
	"Jul",
	"Aug",
	"Sep",
	"Oct",
	"Nov",
	"Dec",
] as const;

// Parses the ISO date directly (no Date object) so the output is stable
// across timezones and identical on server and client.
export function formatDateShort(date: string): string {
	if (!date) return "-";
	const [year, month, day] = date.split("-").map(Number);
	if (!year || !month || !day) return "-";
	return `${MONTHS_SHORT[month - 1]} ${day}, ${year}`;
}
