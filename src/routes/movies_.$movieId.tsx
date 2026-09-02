import { createFileRoute } from "@tanstack/react-router";
import { MoviePage } from "@/pages/movie";

export const Route = createFileRoute("/movies_/$movieId")({
	component: MoviePage,
});
