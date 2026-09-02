/**
 * Minimal in-memory fixed-window rate limiter.
 *
 * Honest scope note: on serverless each instance keeps its own map, so cold
 * starts and parallel lambdas dilute the limit. It meaningfully raises the
 * bar for casual abuse of a costed endpoint; the production path is a
 * durable store (e.g. Upstash Redis) tracked in future-work.
 */

interface IBucket {
	count: number;
	resetAt: number;
}

export interface IRateLimitResult {
	allowed: boolean;
	/** Seconds until the window resets; 0 when allowed. */
	retryAfterSeconds: number;
}

const buckets = new Map<string, IBucket>();

export function rateLimit(
	key: string,
	limit: number,
	windowMs: number,
): IRateLimitResult {
	const now = Date.now();
	const bucket = buckets.get(key);

	if (!bucket || bucket.resetAt <= now) {
		// Opportunistic pruning keeps the map bounded without a timer.
		if (buckets.size > 1000) {
			for (const [k, b] of buckets) {
				if (b.resetAt <= now) buckets.delete(k);
			}
		}
		buckets.set(key, { count: 1, resetAt: now + windowMs });
		return { allowed: true, retryAfterSeconds: 0 };
	}

	if (bucket.count >= limit) {
		return {
			allowed: false,
			retryAfterSeconds: Math.ceil((bucket.resetAt - now) / 1000),
		};
	}

	bucket.count += 1;
	return { allowed: true, retryAfterSeconds: 0 };
}

/**
 * Best-effort client IP behind the platform proxy (Vercel and friends set
 * x-forwarded-for); "local" keeps dev requests under one shared bucket.
 */
export function clientIp(request: Request): string {
	const forwarded = request.headers.get("x-forwarded-for");
	if (forwarded) return forwarded.split(",")[0]?.trim() || "local";
	return request.headers.get("x-real-ip") ?? "local";
}
