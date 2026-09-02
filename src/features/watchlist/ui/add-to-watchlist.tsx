import { Button } from "@/components/ui/button";
import type { TMovieCardData } from "@/entities/movie/model/movie-domain.types";
import { useWatchList } from "../model/use-watchlist";

interface IAddToWatchlistProps {
	movie: TMovieCardData;
}

export function AddToWatchlist({ movie }: IAddToWatchlistProps) {
	const { has, toggle } = useWatchList();
	const inList = has(movie.id);

	return (
		<Button
			variant={inList ? "outline" : "default"}
			aria-pressed={inList}
			aria-label={
				inList
					? `Remove ${movie.title} from watchlist`
					: `Add ${movie.title} to watchlist`
			}
			onClick={() => toggle(movie)}
		>
			{inList ? "✓ In Watchlist" : "+ Watchlist"}
		</Button>
	);
}
