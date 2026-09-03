import { createMiddleware, createServerFn } from "@tanstack/react-start";
import { createSession } from "./llm-runtime";
import { clientIp, rateLimit } from "./rate-limit";

// Generous for a human chat, tight enough to blunt scripted abuse of the
// costed LLM loop behind this endpoint.
const RATE_LIMIT = 10;
const RATE_WINDOW_MS = 60_000;

const rateLimitMiddleware = createMiddleware({ type: "request" }).server(
	({ request, next }) => {
		const { allowed, retryAfterSeconds } = rateLimit(
			`concierge:${clientIp(request)}`,
			RATE_LIMIT,
			RATE_WINDOW_MS,
		);
		if (!allowed) {
			throw new Error(
				`Too many requests. Please wait ${retryAfterSeconds}s and try again.`,
			);
		}
		return next();
	},
);

const SYSTEM_PROMPT = [
	'You are "Concierge", a movie & TV recommendation agent.',
	"You help users discover titles on TMDB",
	"",
	"Rules:",
	"- Use tools for ALL data. Never invent a title, year, or rating.",
	"- Cite real fields from tool results (title, year, rating, genre).",
	'- Format answer: short intro + numbered list, each with a one-line "why"',
	"- If no good match, say so honestly and suggest a nearby alternative.",
	"- Answer in Bahasa Indonesia unless the user writes in English.",
	"- You may call several tools in one turn when it helps.",
	"- Make every recommended MOVIE title a markdown link to its detail page:",
	"  [Title](/movies/{id}) — use the real TMDB id from tool results, never guess.",
	"- Make every recommended TV title a markdown link as well:",
	"  [Title](/tv/{id}).",
	"- Stay on topic: only movies, TV shows, and what to watch. If asked about",
	"  anything else, decline in one sentence and steer back to recommendations.",
].join("\n");

export interface IConciergeContext {
	movieId?: number;
	title?: string;
}

export interface IConciergeMessage {
	role: "user" | "assistant";
	content: string;
}

// Server-side replay guards: bound the history depth and per-message size so
// a long (or hostile) transcript cannot balloon the prompt.
const MAX_HISTORY = 10;
const MAX_MESSAGE_LENGTH = 4000;

function normalizeMessages(input: unknown): IConciergeMessage[] {
	if (!Array.isArray(input)) return [];
	return input
		.filter(
			(m): m is IConciergeMessage =>
				!!m &&
				typeof m === "object" &&
				((m as IConciergeMessage).role === "user" ||
					(m as IConciergeMessage).role === "assistant") &&
				typeof (m as IConciergeMessage).content === "string" &&
				(m as IConciergeMessage).content.length > 0,
		)
		.map((m) => ({ role: m.role, content: m.content.slice(0, MAX_MESSAGE_LENGTH) }))
		.slice(-MAX_HISTORY);
}

/**
 * Prompt = system rules + current page context + replayed transcript, with
 * the newest user message anchored under "Request user:" like before.
 */
export function buildPrompt(
	messages: IConciergeMessage[],
	ctx: IConciergeContext,
): string {
	const lines: string[] = [SYSTEM_PROMPT, ""];

	if (ctx.movieId && ctx.title) {
		lines.push("[Konteks halaman]");
		lines.push(`User sedang melihat film: ${ctx.title} (id: ${ctx.movieId})`);
		lines.push("");
	}

	const history = messages.slice(0, -1);
	for (const message of history) {
		lines.push(
			message.role === "user"
				? `User: ${message.content}`
				: `Assistant: ${message.content}`,
		);
	}
	if (history.length > 0) lines.push("");

	lines.push(`Request user: ${messages[messages.length - 1]?.content ?? ""}`);
	return lines.join("\n");
}

export const concierge = createServerFn({ method: "POST" })
	.middleware([rateLimitMiddleware])
	.validator(
		(data: { messages: IConciergeMessage[]; context?: IConciergeContext }) => ({
			messages: normalizeMessages(data.messages),
			context: data.context,
		}),
	)
	.handler(async ({ data }) => {
		const prompt = buildPrompt(data.messages, data.context ?? {});

		return new ReadableStream<string>({
			async start(controller) {
				const { session } = await createSession();

				session.subscribe((event) => {
					if (
						event.type === "message_update" &&
						event.assistantMessageEvent.type === "text_delta"
					) {
						controller.enqueue(event.assistantMessageEvent.delta);
					}
				});

				try {
					await session.prompt(prompt);
				} catch (error) {
					controller.enqueue(
						`\n [ERROR] ${error instanceof Error ? error.message : String(error)}`,
					);
				} finally {
					controller.close();
				}
			},
		});
	});
