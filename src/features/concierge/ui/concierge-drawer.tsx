import { useQuery } from "@tanstack/react-query";
import { useNavigate, useParams } from "@tanstack/react-router";
import { Film, Lightbulb, MessageCircle, Search, X } from "lucide-react";
import { useEffect, useState } from "react";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import { getMovieDetails } from "@/server/server-functions";
import { useConcierge } from "../api/use-concierge";

const TIPS = [
	{
		Icon: Lightbulb,
		title: "Ask for recommendations",
		description:
			"Describe a mood, an era, or a movie you love and get a shortlist with links.",
		example: "dark 90s sci-fi like Blade Runner",
	},
	{
		Icon: Search,
		title: "Search by genre or vibe",
		description:
			"The agent can combine genres, decades, and ratings while searching.",
		example: "a fun comedy from the 2000s",
	},
	{
		Icon: Film,
		title: "Ask for similar movies",
		description:
			"Open any movie detail page first: the concierge knows which movie you are viewing.",
		example: "something similar to this one",
	},
] as const;

const STALE_TIME = 5 * 60_000;

/**
 * One assistant turn: markdown rendered safely (React elements, not raw
 * HTML) with GFM tables/lists. The agent links titles to internal detail
 * pages — intercept <a> so they use SPA navigation, and aria-live announces
 * streamed tokens without stealing focus.
 */
function AnswerMarkdown({ text }: { text: string }) {
	const navigate = useNavigate();
	return (
		<div aria-live="polite" className="prose prose-invert max-w-none prose-sm">
			<Markdown
				remarkPlugins={[remarkGfm]}
				components={{
					a: ({ href, children }) => (
						<a
							href={href}
							className="font-medium text-primary-glow underline underline-offset-2"
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
				{text}
			</Markdown>
		</div>
	);
}

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
	const [reducedMotion, setReducedMotion] = useState(false);
	const { messages, answer, isStreaming, ask } = useConcierge();

	// Looping gifs cannot honor reduced motion on their own — swap them for
	// static icons when the user asks for less motion.
	useEffect(() => {
		const query = window.matchMedia("(prefers-reduced-motion: reduce)");
		setReducedMotion(query.matches);
	}, []);

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
				aria-label={
					isStreaming ? "AI concierge is thinking" : "Open AI concierge"
				}
				className="fixed right-6 bottom-6 z-50 size-18 overflow-hidden rounded-full bg-transparent p-0 shadow-lg hover:bg-transparent active:scale-95"
				onClick={() => setOpen((value) => !value)}
			>
				{reducedMotion ? (
					<MessageCircle aria-hidden="true" className="size-6" />
				) : (
					<img
						src={isStreaming ? "/assets/thinking.gif" : "/assets/idle.gif"}
						alt=""
						aria-hidden="true"
						draggable={false}
						className="size-18 object-cover"
					/>
				)}
			</Button>

			{open && (
				<section
					role="dialog"
					aria-label="AI concierge"
					className="fixed right-6 bottom-24 z-50 flex h-[440px] w-[min(400px,100vw-3rem)] flex-col rounded-xl border border-border bg-card shadow-xl"
				>
					<header className="flex items-center justify-between border-b border-border px-4 py-2">
						<h2 className="flex items-center gap-2 text-sm font-bold">
							{reducedMotion ? null : (
								<img
									src="/assets/idle.gif"
									alt=""
									aria-hidden="true"
									draggable={false}
									className="size-5 rounded-full object-cover"
								/>
							)}
							Concierge
						</h2>
						<div className="flex items-center gap-1">
							<Dialog>
								<DialogTrigger asChild>
									<Button
										variant="ghost"
										size="sm"
										aria-label="What the concierge can do"
									>
										<Lightbulb aria-hidden="true" />
									</Button>
								</DialogTrigger>
								<DialogContent className="sm:max-w-md">
									<DialogHeader>
										<DialogTitle>What the concierge can do</DialogTitle>
										<DialogDescription>
											Three ways to get the most out of it.
										</DialogDescription>
									</DialogHeader>
									<ul className="space-y-4">
										{TIPS.map(({ Icon, title, description, example }) => (
											<li key={title} className="flex gap-3">
												<span className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-full bg-secondary">
													<Icon
														aria-hidden="true"
														className="size-4 text-foreground"
													/>
												</span>
												<div className="min-w-0 space-y-1">
													<p className="text-sm font-medium">{title}</p>
													<p className="text-sm text-muted-foreground">
														{description}
													</p>
													<p className="font-mono text-xs text-muted-foreground">
														&quot;{example}&quot;
													</p>
												</div>
											</li>
										))}
									</ul>
								</DialogContent>
							</Dialog>
							<Button
								variant="ghost"
								size="sm"
								aria-label="Close concierge"
								onClick={() => setOpen(false)}
							>
								<X aria-hidden="true" />
							</Button>
						</div>
					</header>

					<div className="flex-1 space-y-3 overflow-y-auto px-4 py-3">
						{messages.length === 0 && !isStreaming ? (
							<p className="text-sm text-muted-foreground">
								Ask for recommendations — e.g. &quot;dark 90s sci-fi like Blade
								Runner&quot;.
							</p>
						) : null}
						{messages.map((message, index) =>
							// biome-ignore lint/suspicious/noArrayIndexKey: append-only transcript, never reordered
							message.role === "user" ? (
								<div key={index} className="flex justify-end">
									<p className="max-w-[85%] rounded-lg bg-secondary px-3 py-1.5 text-sm">
										{message.content}
									</p>
								</div>
							) : (
								<AnswerMarkdown key={index} text={message.content} />
							),
						)}
						{isStreaming ? (
							answer ? (
								<AnswerMarkdown text={answer} />
							) : (
								<div className="flex items-center gap-3 text-sm text-muted-foreground">
									{reducedMotion ? (
										<Spinner className="text-muted-foreground" />
									) : (
										<img
											src="/assets/thinking.gif"
											alt=""
											aria-hidden="true"
											draggable={false}
											className="size-9 rounded-full"
										/>
									)}
									Thinking...
								</div>
							)
						) : null}
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
