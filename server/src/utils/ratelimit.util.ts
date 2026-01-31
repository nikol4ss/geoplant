import { AuthErrors } from '@/modules/auth/auth.error.js';

type RateEntry = {
  count: number;
  expiresAt: number;
};

const store = new Map<string, RateEntry>();

export function rateLimit(key: string, limit: number, windowMs: number) {
  const now = Date.now();
  const entry = store.get(key);

  if (!entry || entry.expiresAt < now) {
    store.set(key, {
      count: 1,
      expiresAt: now + windowMs,
    });
    return;
  }

  if (entry.count >= limit) {
    throw AuthErrors.RATE_LIMIT_EXCEEDED();
  }

  entry.count++;
}
