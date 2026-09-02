import { createServerFn } from "@tanstack/react-start";
import { createSession } from "./llm-runtime";

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

function buildPrompt(userInput: string, ctx: IConciergeContext): string {
	const lines: string[] = [SYSTEM_PROMPT, ""];

	if (ctx.movieId && ctx.title) {
		lines.push("[Konteks halaman]");
		lines.push(`User sedang melihat film: ${ctx.title} (id: ${ctx.movieId})`);
		lines.push("");
	}

	lines.push(`Request user: ${userInput}`);
	return lines.join("\n");
}

export const concierge = createServerFn({ method: "POST" })
	.validator((data: { prompt: string; context?: IConciergeContext }) => data)
	.handler(async ({ data }) => {
		const prompt = buildPrompt(data.prompt, data.context ?? {});

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
