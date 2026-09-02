import { Star } from "lucide-react";
import { useRating } from "../model/use-rating";

const VALUES = [1, 2, 3, 4, 5] as const;

interface IRateMovieProps {
	movieId: number;
}

export function RateMovie({ movieId }: IRateMovieProps) {
	const { get, set, remove } = useRating();
	const current = get(movieId);

	return (
		// No group role needed: each button's aria-label is fully
		// self-describing ("Rate 3 stars" / "Remove rating").
		<div className="flex flex-col gap-0.5">
			<div className="flex items-center gap-1">
				{VALUES.map((value) => {
					const filled = current !== undefined && value <= current;
					const isCurrent = current === value;
					return (
						<button
							key={value}
							type="button"
							aria-label={
								isCurrent
									? `Remove rating (${value} ${value === 1 ? "star" : "stars"})`
									: `Rate ${value} ${value === 1 ? "star" : "stars"}`
							}
							onClick={() =>
								isCurrent ? remove(movieId) : set(movieId, value)
							}
							className="rounded-sm focus-visible:outline-2 focus-visible:outline-ring"
						>
							<Star
								className={
									filled
										? "h-5 w-5 fill-primary text-primary"
										: "h-5 w-5 text-muted-foreground"
								}
							/>
						</button>
					);
				})}
				{current !== undefined && (
					<span className="ml-2 text-xs text-muted-foreground">
						{current}/5
					</span>
				)}
			</div>
			{current !== undefined && (
				<span className="text-[10px] text-muted-foreground/75">
					Click the same star to remove
				</span>
			)}
		</div>
	);
}
