import { useNavigate } from "@tanstack/react-router";
import { Search } from "lucide-react";
import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";

const DEBOUNCE_MS = 300;

interface ISearchBarProps {
	/** Initial query (kept in sync by the page via a `key` remount). */
	defaultValue?: string;
}

/**
 * URL-driven search input: typing updates the `?q=` search param after a
 * 300ms debounce; pressing Enter submits immediately. The URL stays the
 * single source of truth — refresh/share/back all keep the query.
 */
export function SearchBar({ defaultValue = "" }: ISearchBarProps) {
	const navigate = useNavigate({ from: "/search" });
	const [value, setValue] = useState(defaultValue);

	useEffect(() => {
		const timeout = setTimeout(() => {
			// replace: true keeps debounced typing out of the history stack
			navigate({ search: value ? { q: value } : {}, replace: true });
		}, DEBOUNCE_MS);
		return () => clearTimeout(timeout);
	}, [value, navigate]);

	return (
		<search>
			<form
				onSubmit={(event) => {
					event.preventDefault();
					navigate({ search: value ? { q: value } : {} });
				}}
			>
				<div className="relative w-full sm:max-w-md">
					<Search
						aria-hidden="true"
						className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground/75"
					/>
					<Input
						type="search"
						value={value}
						onChange={(event) => setValue(event.target.value)}
						placeholder="Search movies..."
						aria-label="Search movies"
						className="w-full pl-9"
						autoComplete="off"
					/>
				</div>
			</form>
		</search>
	);
}
