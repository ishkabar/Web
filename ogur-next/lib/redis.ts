import Redis from "ioredis";

let redis: Redis | null = null;

function getRedis(): Redis {
    if (!redis) {
        redis = new Redis(process.env.REDIS_URL || "redis://localhost:6379", {
            maxRetriesPerRequest: 3,
            lazyConnect: true,
            enableOfflineQueue: false,
        });
    }
    return redis;
}

export { getRedis as redis };