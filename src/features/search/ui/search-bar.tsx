import { useNavigate } from "@tanstack/react-router";
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
				<Input
					type="search"
					value={value}
					onChange={(event) => setValue(event.target.value)}
					placeholder="Search movies..."
					aria-label="Search movies"
					className="w-full sm:max-w-md"
					autoComplete="off"
				/>
			</form>
		</search>
	);
}
