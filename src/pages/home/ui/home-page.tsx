import {
	usePopularMovies,
	useUpcomingMovies,
} from "@/entities/movie/model/movie.queries";
import { usePopularTv } from "@/entities/tv/model/tv.queries";
import { movieToRowItem, tvToRowItem } from "../model/row-adapters";
import { Hero } from "./hero";
import { Row } from "./row";

export const HomePage = () => {
	// Popular Movies
	const popularMovie = usePopularMovies();
	const heroMovies = popularMovie.data?.results ?? [];

	// Upcoming Movie
	const upcomingMovie = useUpcomingMovies();

	// Popular TV
	const popularTv = usePopularTv();

	return (
		<main className="mx-auto w-[min(1280px,100%-2rem)] space-y-8 py-8">
			<Hero movies={heroMovies} />

			<Row
				heading="Popular Movies"
				items={(popularMovie.data?.results ?? []).map(movieToRowItem)}
				isLoading={popularMovie.isLoading}
				isError={popularMovie.isError}
				onRetry={() => popularMovie.refetch()}
			/>

			<Row
				heading="Popular TV"
				items={(popularTv.data?.results ?? []).map(tvToRowItem)}
				isLoading={popularTv.isLoading}
				isError={popularTv.isError}
				onRetry={() => popularTv.refetch()}
				linked={false}
			/>

			<Row
				heading="Upcoming Movies"
				items={(upcomingMovie.data?.results ?? []).map(movieToRowItem)}
				isLoading={upcomingMovie.isLoading}
				isError={upcomingMovie.isError}
				onRetry={() => upcomingMovie.refetch()}
			/>
		</main>
	);
};
