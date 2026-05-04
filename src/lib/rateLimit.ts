/**
 * Simple in-memory rate limiter for SvelteKit server routes.
 * Limits each IP to `maxRequests` per `windowMs` milliseconds.
 */

type Entry = { count: number; resetAt: number };

const store = new Map<string, Entry>();

export function rateLimit(
	ip: string,
	maxRequests = 3,
	windowMs = 60_000
): { allowed: boolean; retryAfterMs: number } {
	const now = Date.now();
	const entry = store.get(ip);

	if (!entry || now > entry.resetAt) {
		store.set(ip, { count: 1, resetAt: now + windowMs });
		return { allowed: true, retryAfterMs: 0 };
	}

	if (entry.count >= maxRequests) {
		return { allowed: false, retryAfterMs: entry.resetAt - now };
	}

	entry.count++;
	return { allowed: true, retryAfterMs: 0 };
}
