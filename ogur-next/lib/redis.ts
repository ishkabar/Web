import Redis from "ioredis";

let redis: Redis | null = null;

function getRedis(): Redis {
    if (!redis) {
        redis = new Redis(process.env.REDIS_URL || "redis://localhost:6379", {
            maxRetriesPerRequest: 1,
            lazyConnect: true,
            enableOfflineQueue: false,
            retryStrategy: () => null,
        });
        
        redis.on('error', (err) => {
            console.log('Redis connection error (ignored during build):', err.message);
        });
    }
    return redis;
}

export { getRedis as redis };