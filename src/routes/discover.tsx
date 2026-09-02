import { createFileRoute } from "@tanstack/react-router";
import { DiscoverPage } from "@/pages/discover";

export const Route = createFileRoute("/discover")({ component: DiscoverPage });
