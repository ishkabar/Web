/**
 * No-Redis stub for production without Upstash.
 * Typed so calls like redis.get<number>(...) work.
 */
export interface RedisClient {
  get<T = number>(key: string): Promise<T | null>;
  incr(key: string): Promise<void>;
}

export const redis: RedisClient = {
  async get<T = number>(_key: string): Promise<T | null> {
    return null; // caller usually does ?? 0
  },
  async incr(_key: string): Promise<void> {
    // no-op
  },
};
