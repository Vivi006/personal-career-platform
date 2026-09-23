import { Ratelimit } from '@upstash/ratelimit';
import { NextResponse } from 'next/server';

import { getRedis } from './redis';

type RateLimitPreset = 'auth' | 'chat' | 'publicForm';

const presets: Record<RateLimitPreset, { requests: number; window: `${number} ${'m' | 'h'}` }> = {
  auth: { requests: 5, window: '1 m' },
  chat: { requests: 30, window: '1 m' },
  publicForm: { requests: 10, window: '10 m' },
};

const limiters = new Map<RateLimitPreset, Ratelimit>();

function getLimiter(preset: RateLimitPreset) {
  const existing = limiters.get(preset);

  if (existing) {
    return existing;
  }

  const config = presets[preset];
  const limiter = new Ratelimit({
    redis: getRedis(),
    limiter: Ratelimit.slidingWindow(config.requests, config.window),
    analytics: true,
    prefix: `career-platform:ratelimit:${preset}`,
  });

  limiters.set(preset, limiter);
  return limiter;
}

export function getClientIp(request: Request) {
  return (
    request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    request.headers.get('x-real-ip') ||
    'unknown'
  );
}

export async function enforceRateLimit(request: Request, preset: RateLimitPreset) {
  const identifier = `${preset}:${getClientIp(request)}`;
  const result = await getLimiter(preset).limit(identifier);

  if (result.success) {
    return null;
  }

  return NextResponse.json(
    { error: 'Trop de requêtes. Veuillez réessayer dans quelques instants.' },
    {
      status: 429,
      headers: {
        'Retry-After': String(Math.max(1, Math.ceil((result.reset - Date.now()) / 1000))),
        'X-RateLimit-Limit': String(result.limit),
        'X-RateLimit-Remaining': String(result.remaining),
      },
    },
  );
}
