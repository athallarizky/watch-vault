import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/movies_/$movieId")({
	component: () => <div>test</div>,
});
