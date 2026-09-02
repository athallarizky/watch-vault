import { useQuery } from "@tanstack/react-query";
import { useNavigate, useParams } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import { getMovieDetails } from "@/server/server-functions";
import { useConcierge } from "../api/use-concierge";

const STALE_TIME = 5 * 60_000;

/**
 * Mounted once in the root layout so its state (conversation, open/closed)
 * survives navigation. Page context is derived from the current route:
 * on a movie detail page, the agent is told which movie is being viewed.
 * The details query mirrors the page's hook key — it reads the shared
 * cache entry, so no extra request is fired.
 */
export function ConciergeDrawer() {
	const [open, setOpen] = useState(false);
	const [prompt, setPrompt] = useState("");
	const { answer, isStreaming, ask } = useConcierge();
	const navigate = useNavigate();

	const params = useParams({ strict: false });
	const routeMovieId =
		typeof params.movieId === "string" ? Number(params.movieId) : undefined;

	const { data: movie } = useQuery({
		queryKey: ["movie", "details", routeMovieId ?? 0],
		queryFn: () => getMovieDetails({ data: { movieId: routeMovieId ?? 0 } }),
		enabled: routeMovieId !== undefined,
		staleTime: STALE_TIME,
	});

	useEffect(() => {
		if (!open) return;
		function onKeyDown(event: KeyboardEvent) {
			if (event.key === "Escape") setOpen(false);
		}
		window.addEventListener("keydown", onKeyDown);
		return () => window.removeEventListener("keydown", onKeyDown);
	}, [open]);

	function submit() {
		const value = prompt.trim();
		if (!value || isStreaming) return;
		setPrompt("");
		ask(
			value,
			movie && routeMovieId !== undefined
				? { movieId: routeMovieId, title: movie.title }
				: undefined,
		);
	}

	return (
		<>
			<Button
				aria-expanded={open}
				aria-haspopup="dialog"
				className="fixed right-6 bottom-6 z-50 rounded-full shadow-lg"
				onClick={() => setOpen((value) => !value)}
			>
				✨ Concierge
			</Button>

			{open && (
				<section
					role="dialog"
					aria-label="AI concierge"
					className="fixed right-6 bottom-24 z-50 flex h-[440px] w-[min(400px,100vw-3rem)] flex-col rounded-xl border border-border bg-card shadow-xl"
				>
					<header className="flex items-center justify-between border-b border-border px-4 py-2">
						<h2 className="text-sm font-bold">✨ Concierge</h2>
						<Button
							variant="ghost"
							size="sm"
							aria-label="Close concierge"
							onClick={() => setOpen(false)}
						>
							✕
						</Button>
					</header>

					<div className="flex-1 space-y-3 overflow-y-auto px-4 py-3">
						{answer ? (
							// aria-live announces streamed tokens to screen readers
							// without stealing focus. The agent answers in markdown —
							// rendered safely (React elements, not raw HTML) with GFM
							// tables/lists, styled by the Tailwind typography plugin.
							<div
								aria-live="polite"
								className="prose prose-invert max-w-none prose-sm"
							>
								<Markdown
									remarkPlugins={[remarkGfm]}
									components={{
										// The agent links movie titles to internal detail
										// pages — intercept <a> so they use SPA navigation
										// instead of a full page reload.
										a: ({ href, children }) => (
											<a
												href={href}
												className="font-medium text-primary underline underline-offset-2"
												onClick={(event) => {
													if (!href?.startsWith("/")) return;
													event.preventDefault();
													navigate({ to: href });
												}}
											>
												{children}
											</a>
										),
									}}
								>
									{answer}
								</Markdown>
							</div>
						) : isStreaming ? (
							<Spinner className="text-muted-foreground" />
						) : (
							<p className="text-sm text-muted-foreground">
								Ask for recommendations — e.g. &quot;dark 90s sci-fi like Blade
								Runner&quot;.
							</p>
						)}
					</div>

					<form
						className="flex gap-2 border-t border-border p-3"
						onSubmit={(event) => {
							event.preventDefault();
							submit();
						}}
					>
						<Input
							value={prompt}
							onChange={(event) => setPrompt(event.target.value)}
							placeholder="Ask for recommendations..."
							aria-label="Message the concierge"
							disabled={isStreaming}
							autoComplete="off"
						/>
						<Button
							type="submit"
							size="sm"
							disabled={isStreaming || prompt.trim().length === 0}
						>
							{isStreaming ? <Spinner /> : "Ask"}
						</Button>
					</form>
				</section>
			)}
		</>
	);
}
