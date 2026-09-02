import { createFileRoute } from "@tanstack/react-router";
import { TvPage } from "@/pages/tv";

export const Route = createFileRoute("/tv_/$tvId")({
	component: TvPage,
});
