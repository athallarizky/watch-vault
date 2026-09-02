import { Star } from "lucide-react";
import { cn } from "@/lib/utils";
import { formatRating, formatVoteCount } from "@/shared/lib/format";

interface IRatingStarProps {
	vote: number;
	/** Optional vote count shown as a trust signal next to the score. */
	voteCount?: number;
	className?: string;
}

/** Compact rating presentation: filled brand star, score, and vote count. */
export function RatingStar({ vote, voteCount, className }: IRatingStarProps) {
	return (
		<span className={cn("inline-flex items-center gap-1", className)}>
			<Star aria-hidden="true" className="size-3 fill-primary text-primary" />
			<span>{formatRating(vote)}</span>
			{typeof voteCount === "number" && voteCount > 0 ? (
				<>
					<span aria-hidden="true">·</span>
					<span className="text-muted-foreground">
						{formatVoteCount(voteCount)}
					</span>
				</>
			) : null}
		</span>
	);
}
