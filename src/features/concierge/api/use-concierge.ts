import { useCallback, useRef, useState } from "react";
import type {
	IConciergeContext,
	IConciergeMessage,
} from "@/server/concierge-agent";
import { concierge } from "@/server/concierge-agent";

/**
 * Client-owned conversation memory (Tier 1): the hook keeps the full
 * transcript and sends it with every ask; the server replays it before the
 * new request. The ref mirrors state so `ask` never reads a stale list.
 * `answer` stays the in-flight stream buffer and is committed to the
 * transcript once the stream closes (errors commit too, so the replayed
 * history still makes sense).
 */
export function useConcierge() {
	const [messages, setMessages] = useState<IConciergeMessage[]>([]);
	const [answer, setAnswer] = useState("");
	const [isStreaming, setIsStreaming] = useState(false);
	const transcriptRef = useRef<IConciergeMessage[]>([]);

	const ask = useCallback(async (prompt: string, context?: IConciergeContext) => {
		setAnswer("");
		setIsStreaming(true);

		const transcript = [
			...transcriptRef.current,
			{ role: "user" as const, content: prompt },
		];
		transcriptRef.current = transcript;
		setMessages(transcript);

		let reply = "";
		try {
			const stream = await concierge({ data: { messages: transcript, context } });
			const reader = stream.getReader();
			for (;;) {
				const { done, value } = await reader.read();
				if (done) break;
				reply += value;
				setAnswer(reply);
			}
		} catch (error) {
			reply += `\n[ERROR] ${error instanceof Error ? error.message : String(error)}`;
		} finally {
			setAnswer("");
			const next = [...transcriptRef.current, { role: "assistant" as const, content: reply }];
			transcriptRef.current = next;
			setMessages(next);
			setIsStreaming(false);
		}
	}, []);

	return { messages, answer, isStreaming, ask };
}
