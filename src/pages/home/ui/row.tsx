import { Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { imageUrl } from "@/shared/lib/format";

export type TRowItem = {
	id: number;
	title: string;
	year: string;
	rating: string;
	backdropPath: string | null;
};

interface IRowProps {
	heading: string;
	items: TRowItem[];
	isLoading: boolean;
	isError: boolean;
	onRetry: () => void;
	/** Set false for items with no detail route in scope (e.g. TV) — renders plain cards. */
	linked?: boolean;
}

function RowSkeleton() {
	return (
		<div className="flex gap-4 overflow-hidden">
			{Array.from({ length: 6 }).map((_, i) => (
				// biome-ignore lint/suspicious/noArrayIndexKey: static placeholder (never rerender)
				<Skeleton key={i} className="h-[135px] w-[240px] shrink-0" />
			))}
		</div>
	);
}

function ItemContent({ item }: { item: TRowItem }) {
	return (
		<>
			{item.backdropPath ? (
				<img
					src={imageUrl(item.backdropPath, "w780") ?? ""}
					alt={item.title}
					width={780}
					height={439}
					loading="lazy"
					decoding="async"
					className="aspect-video w-full rounded-md object-cover"
				/>
			) : (
				<div className="flex aspect-video w-full items-center justify-center rounded-md bg-muted p-2 text-center text-xs text-muted-foreground">
					{item.title}
				</div>
			)}
			<div className="mt-1.5 flex items-baseline justify-between gap-2">
				<span className="line-clamp-1 text-sm font-medium">{item.title}</span>
				<span className="shrink-0 text-xs text-muted-foreground">
					{item.year} · ★ {item.rating}
				</span>
			</div>
		</>
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
		<div className="flex gap-4 overflow-x-auto snap-x pb-2">
			{props.items.map((item) =>
				props.linked === false ? (
					<div key={item.id} className="w-[240px] shrink-0 snap-start">
						<ItemContent item={item} />
					</div>
				) : (
					<Link
						key={item.id}
						to="/movies/$movieId"
						params={{ movieId: String(item.id) }}
						className="w-[240px] shrink-0 snap-start"
					>
						<ItemContent item={item} />
					</Link>
				),
			)}
		</div>
	);
}

export const Row = (props: IRowProps) => {
	return (
		<section aria-label={props.heading}>
			<h2 className="mb-3 text-lg font-bold">{props.heading}</h2>
			<RowBody {...props} />
		</section>
	);
};
