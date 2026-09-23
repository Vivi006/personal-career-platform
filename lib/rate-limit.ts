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
const localAttempts = new Map<string, { count: number; reset: number }>();
let warnedAboutLocalRateLimit = false;

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
  const config = presets[preset];
  const hasRedisConfiguration =
    Boolean(process.env.UPSTASH_REDIS_REST_URL) &&
    Boolean(process.env.UPSTASH_REDIS_REST_TOKEN);

  if (!hasRedisConfiguration) {
    if (process.env.NODE_ENV === 'production') {
      throw new Error('La configuration Upstash Redis est requise en production.');
    }

    if (!warnedAboutLocalRateLimit) {
      console.warn(
        'Upstash Redis non configuré : rate limiting local de développement activé.',
      );
      warnedAboutLocalRateLimit = true;
    }

    const now = Date.now();
    const current = localAttempts.get(identifier);
    const windowMs = preset === 'publicForm' ? 10 * 60 * 1000 : 60 * 1000;
    const reset = current && current.reset > now ? current.reset : now + windowMs;
    const count = current && current.reset > now ? current.count + 1 : 1;

    localAttempts.set(identifier, { count, reset });

    if (count > config.requests) {
      return NextResponse.json(
        { error: 'Trop de requêtes. Veuillez réessayer dans quelques instants.' },
        {
          status: 429,
          headers: {
            'Retry-After': String(Math.max(1, Math.ceil((reset - now) / 1000))),
            'X-RateLimit-Limit': String(config.requests),
            'X-RateLimit-Remaining': '0',
          },
        },
      );
    }

    return null;
  }

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
