import { Link } from "@tanstack/react-router";
import { ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
	Carousel,
	CarouselContent,
	CarouselItem,
	CarouselNext,
	CarouselPrevious,
} from "@/components/ui/carousel";
import { Skeleton } from "@/components/ui/skeleton";
import { imageUrl } from "@/shared/lib/format";
import { RatingStar } from "@/shared/ui/rating-star";

export type TRowItem = {
	id: number;
	title: string;
	year: string;
	voteAverage: number;
	voteCount: number;
	overview: string;
	posterPath: string | null;
};

interface IRowProps {
	heading: string;
	items: TRowItem[];
	isLoading: boolean;
	isError: boolean;
	onRetry: () => void;
	/** Set false for items with no detail route in scope (e.g. TV) — renders plain cards. */
	linked?: boolean;
	/** Discover tab id carried into the See All deep link (e.g. "tv-popular"). */
	seeAllTab?: string;
}

// Mirrors the skeleton grid breakpoints below so loading matches the layout.
const SLIDE_BASIS =
	"basis-1/2 sm:basis-1/3 md:basis-1/4 lg:basis-1/5 xl:basis-1/6";

// Edge-zone controls: a long, weak linear scrim (no solid band) so the last
// poster stays visible through the fade. Revealed by row hover or keyboard
// focus only — :focus-visible, not focus-within, so a mouse click does not
// pin the controls open after the pointer leaves the row.
const ARROW_BASE =
	"top-0 bottom-0 h-auto w-20 translate-y-0 rounded-none border-0 p-0 text-foreground opacity-0 transition-opacity duration-300 group-hover/row:opacity-100 group-has-[:focus-visible]/row:opacity-100 focus-visible:opacity-100 hover:bg-transparent dark:hover:bg-transparent disabled:opacity-0";

function RowSkeleton() {
	return (
		<div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
			{Array.from({ length: 6 }).map((_, i) => (
				// biome-ignore lint/suspicious/noArrayIndexKey: static placeholder (never rerender)
				<Skeleton key={i} className="aspect-[2/3] w-full rounded-lg" />
			))}
		</div>
	);
}

function ItemContent({ item }: { item: TRowItem }) {
	return (
		// py-1 gives the hover scale room inside the carousel viewport clip.
		<div className="group/card py-1">
			<div className="relative aspect-[2/3] overflow-hidden rounded-lg bg-muted ring-1 ring-border transition-all duration-200 group-hover/card:scale-[1.02] group-hover/card:shadow-xl group-hover/card:shadow-black/50 group-hover/card:ring-foreground/25 group-focus-within/card:scale-[1.02]">
				{item.posterPath ? (
					<img
						src={imageUrl(item.posterPath, "w342") ?? ""}
						alt={item.title}
						width={342}
						height={513}
						loading="lazy"
						decoding="async"
						className="h-full w-full object-cover"
					/>
				) : (
					<div className="flex h-full w-full items-center justify-center p-3 text-center text-xs text-muted-foreground">
						{item.title}
					</div>
				)}
				{item.overview ? (
					<div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-background via-background/85 to-transparent p-3 pt-10 opacity-0 transition-opacity duration-200 group-hover/card:opacity-100">
						<p className="line-clamp-3 text-xs leading-snug text-foreground/90">
							{item.overview}
						</p>
					</div>
				) : null}
			</div>
			<div className="mt-2 space-y-0.5">
				<h3 className="line-clamp-1 text-sm font-medium">{item.title}</h3>
				<p className="flex items-center gap-1.5 text-xs text-muted-foreground">
					<span>{item.year}</span>
					<span aria-hidden="true">·</span>
					<RatingStar vote={item.voteAverage} voteCount={item.voteCount} />
				</p>
			</div>
		</div>
	);
}

function RowBody(props: IRowProps) {
	if (props.isLoading) return <RowSkeleton />;
	if (props.isError)
		return (
			<div className="flex items-center gap-3">
				<p className="text-sm text-muted-foreground">
					Failed to load {props.heading.toLowerCase()}.
				</p>
				<Button variant="outline" size="sm" onClick={props.onRetry}>
					Retry
				</Button>
			</div>
		);

	if (props.items.length === 0)
		return <p className="text-sm text-muted-foreground">No data yet.</p>;

	return (
		// Loop wraps the row endlessly so the controls never disable at the end
		// (a vanishing next button is what causes accidental detail-page clicks).
		// slidesToScroll "auto" scales each jump to the swipe's momentum.
		<Carousel opts={{ align: "start", loop: true, slidesToScroll: "auto" }}>
			<CarouselContent>
				{props.items.map((item) => (
					<CarouselItem key={item.id} className={SLIDE_BASIS}>
						{props.linked === false ? (
							<ItemContent item={item} />
						) : (
							<Link
								to="/movies/$movieId"
								params={{ movieId: String(item.id) }}
								className="rounded-lg focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
							>
								<ItemContent item={item} />
							</Link>
						)}
					</CarouselItem>
				))}
			</CarouselContent>
			<CarouselPrevious
				variant="ghost"
				className={`${ARROW_BASE} left-0 justify-start ps-3 bg-gradient-to-r from-background/95 to-transparent`}
			/>
			<CarouselNext
				variant="ghost"
				className={`${ARROW_BASE} right-0 justify-end pe-3 bg-gradient-to-l from-background/95 to-transparent`}
			/>
		</Carousel>
	);
}

export const Row = (props: IRowProps) => {
	return (
		<section aria-label={props.heading} className="group/row">
			<div className="mb-4 flex items-baseline justify-between gap-4">
				<h2 className="text-display-sm">{props.heading}</h2>
				{props.seeAllTab ? (
					<Link
						to="/discover"
						search={{ tab: props.seeAllTab }}
						className="inline-flex shrink-0 items-center gap-0.5 rounded-sm text-sm text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
					>
						See All
						<ChevronRight aria-hidden="true" className="size-4" />
					</Link>
				) : null}
			</div>
			<RowBody {...props} />
		</section>
	);
};
