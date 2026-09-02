import { createFileRoute } from "@tanstack/react-router";
import { PersonPage } from "@/pages/person";

export const Route = createFileRoute("/people_/$personId")({
	component: PersonPage,
});
