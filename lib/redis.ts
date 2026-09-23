import { Redis } from '@upstash/redis';

let redisClient: Redis | undefined;

function getRequiredEnv(name: 'UPSTASH_REDIS_REST_URL' | 'UPSTASH_REDIS_REST_TOKEN') {
  const value = process.env[name];

  if (!value) {
    throw new Error(`La variable d'environnement ${name} est requise pour Upstash Redis.`);
  }

  return value;
}

export function getRedis(): Redis {
  if (!redisClient) {
    redisClient = new Redis({
      url: getRequiredEnv('UPSTASH_REDIS_REST_URL'),
      token: getRequiredEnv('UPSTASH_REDIS_REST_TOKEN'),
    });
  }

  return redisClient;
}
