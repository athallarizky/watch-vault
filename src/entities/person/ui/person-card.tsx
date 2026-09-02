import { imageUrl } from "@/shared/lib/format";
import type { IPerson } from "../model/person-domain.types";

export function PersonCard({ person }: { person: IPerson }) {
	const profile = imageUrl(person.profilePath, "w185");

	return (
		<article>
			{profile ? (
				<img
					src={profile}
					alt={person.name}
					width={185}
					height={278}
					loading="lazy"
					decoding="async"
					className="aspect-[2/3] w-full rounded-md object-cover"
				/>
			) : (
				<div className="flex aspect-[2/3] w-full items-center justify-center rounded-md bg-muted p-4 text-center text-sm text-muted-foreground">
					{person.name}
				</div>
			)}
			<div className="mt-2 space-y-1">
				<h3 className="line-clamp-1 text-sm font-semibold">{person.name}</h3>
				<p className="text-xs text-muted-foreground">
					{person.knownForDepartment}
				</p>
			</div>
		</article>
	);
}
