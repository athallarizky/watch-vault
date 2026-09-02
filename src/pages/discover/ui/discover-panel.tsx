import { useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import type { IMovieList } from "@/entities/movie/model/movie-domain.types";
import { MovieCard } from "@/entities/movie/ui/movie-card";
import type { IPersonList } from "@/entities/person/model/person-domain.types";
import { PersonCard } from "@/entities/person/ui/person-card";
import type { ITvShowList } from "@/entities/tv/model/tv-domain.types";
import { TvCard } from "@/entities/tv/ui/tv-card";
import type { TDiscoverFeed } from "../model/discover-tabs";

// Mirrors the home row card density so both browse surfaces feel the same.
const GRID_CLASS =
	"grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6";

// The sentinel fires this early so the next page usually arrives before the
// user reaches the bottom.
const SENTINEL_ROOT_MARGIN = "600px";
const NEXT_PAGE_SKELETONS = 6;

function SkeletonGrid({ count }: { count: number }) {
	return (
		<div className={GRID_CLASS}>
			{Array.from({ length: count }).map((_, i) => (
				// biome-ignore lint/suspicious/noArrayIndexKey: static placeholder list, never reordered
				<Skeleton key={i} className="aspect-[2/3] w-full rounded-lg" />
			))}
		</div>
	);
}

interface IDiscoverPanelProps {
	kind: "movie" | "tv" | "person";
	feed: TDiscoverFeed;
}

export function DiscoverPanel({ kind, feed }: IDiscoverPanelProps) {
	const {
		data,
		isLoading,
		isError,
		refetch,
		fetchNextPage,
		hasNextPage,
		isFetchingNextPage,
	} = feed;
	const sentinelRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		const el = sentinelRef.current;
		if (!el || !hasNextPage) return;
		const observer = new IntersectionObserver(
			(entries) => {
				if (entries[0]?.isIntersecting && !isFetchingNextPage) {
					fetchNextPage();
				}
			},
			{ rootMargin: SENTINEL_ROOT_MARGIN },
		);
		observer.observe(el);
		return () => observer.disconnect();
	}, [hasNextPage, isFetchingNextPage, fetchNextPage]);

	if (isLoading) return <SkeletonGrid count={12} />;
	if (isError)
		return (
			<div className="flex items-center gap-3">
				<p className="text-sm text-muted-foreground">Failed to load titles.</p>
				<Button variant="outline" size="sm" onClick={() => refetch()}>
					Retry
				</Button>
			</div>
		);

	const pages = data?.pages ?? [];
	if (pages.length === 0 || pages.every((page) => page.results.length === 0))
		return <p className="text-sm text-muted-foreground">No titles found.</p>;

	return (
		<div className="space-y-4">
			<div className={GRID_CLASS}>
				{kind === "movie"
					? pages
							.flatMap((page) => (page as unknown as IMovieList).results)
							.map((movie) => <MovieCard key={movie.id} movie={movie} />)
					: kind === "tv"
						? pages
								.flatMap((page) => (page as unknown as ITvShowList).results)
								.map((show) => <TvCard key={show.id} show={show} />)
						: // Same serializer-transform union as discover-tabs: one guarded cast.
							pages
								.flatMap((page) => (page as unknown as IPersonList).results)
								.map((person) => (
									<PersonCard key={person.id} person={person} />
								))}
			</div>
			{isFetchingNextPage ? <SkeletonGrid count={NEXT_PAGE_SKELETONS} /> : null}
			<div ref={sentinelRef} aria-hidden="true" className="h-px" />
		</div>
	);
}
