import { useCallback, useState } from "react";
import type { IConciergeContext } from "@/server/concierge-agent";
import { concierge } from "@/server/concierge-agent";

export function useConcierge() {
	const [answer, setAnswer] = useState("");
	const [isStreaming, setIsStreaming] = useState(false);

	const ask = useCallback(
		async (prompt: string, context?: IConciergeContext) => {
			setAnswer("");
			setIsStreaming(true);
			try {
				const stream = await concierge({ data: { prompt, context } });
				const reader = stream.getReader();
				for (;;) {
					const { done, value } = await reader.read();
					if (done) break;
					setAnswer((prev) => prev + value);
				}
			} catch (error) {
				setAnswer(
					(prev) =>
						prev +
						`\n[ERROR] ${error instanceof Error ? error.message : String(error)}`,
				);
			} finally {
				setIsStreaming(false);
			}
		},
		[],
	);

	return { answer, isStreaming, ask };
}
