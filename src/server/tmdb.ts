export class TmdbError extends Error {
	constructor(
		message: string,
		readonly status: number,
		readonly path: string,
	) {
		super(message);
		this.name = "TmdbError";
	}
}

function getBaseUrl(): string {
	return process.env.TMDB_BASE_URL ?? "https://api.themoviedb.org/3";
}

export function tmdbUrl(
	path: string,
	params: Record<string, string | number | undefined> = {},
) {
	const url = new URL(`${getBaseUrl()}${path}`);
	for (const [key, value] of Object.entries(params)) {
		if (value !== undefined && value !== "") {
			url.searchParams.set(key, String(value));
		}
	}
	return url.toString();
}

export async function tmdbGet<T>(
	path: string,
	params: Record<string, string | number | undefined> = {},
): Promise<T> {
	const apiKey = process.env.TMDB_API_KEY;
	if (!apiKey) {
		throw new TmdbError("TMDB_API_KEY is not set", 0, path);
	}

	const url = tmdbUrl(path, { ...params, api_key: apiKey });
	const res = await fetch(url);

	if (!res.ok) {
		throw new TmdbError(
			`TMDB request failed: ${res.statusText}`,
			res.status,
			path,
		);
	}

	return (await res.json()) as T;
}
