import { Badge } from "@/components/ui/badge";

/** Small overlay chip marking a card's media type (Movie / TV). */
export function MediaTypeChip({ type }: { type: "Movie" | "TV" }) {
	return (
		<Badge
			variant="secondary"
			className="absolute left-2 top-2 bg-background/80 px-2 py-0.5 text-[10px] font-semibold tracking-wide backdrop-blur"
		>
			{type}
		</Badge>
	);
}
