type RateLimitOptions = {
  limit: number;
  windowMs: number;
};

type Entry = {
  count: number;
  expiresAt: number;
};

const store = new Map<string, Entry>();

// Reusable presets for cost control (fewer DB/external calls when limit hit)
export const RATE_LIMIT_PRESETS = {
  resetLink: { limit: 5, windowMs: 24 * 60 * 60 * 1000 },
  auth: { limit: 20, windowMs: 60 * 1000 },
} as const;

export function rateLimit(key: string, { limit, windowMs }: RateLimitOptions) {
  const now = Date.now();
  const entry = store.get(key);

  if (!entry || entry.expiresAt < now) {
    store.set(key, { count: 1, expiresAt: now + windowMs });
    return { allowed: true, remaining: limit - 1 };
  }

  if (entry.count >= limit) {
    return { allowed: false, remaining: 0 };
  }

  entry.count++;
  return { allowed: true, remaining: limit - entry.count };
}

// Remove expired entries periodically to prevent unbounded Map growth (memory/cost)
const CLEANUP_INTERVAL_MS = 60_000;
let cleanupScheduled = false;
function scheduleCleanup() {
  if (cleanupScheduled) return;
  cleanupScheduled = true;
  setInterval(() => {
    const now = Date.now();
    Array.from(store.entries()).forEach(([k, v]) => {
      if (v.expiresAt < now) store.delete(k);
    });
  }, CLEANUP_INTERVAL_MS);
}
scheduleCleanup();
