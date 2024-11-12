import { Redis } from "@upstash/redis";

let redis: Redis;
async function createRedisConnection() {
    try {
        redis = new Redis({
            url: Deno.env.get("UPSTASH_REDIS_REST_URL")!,
            token: Deno.env.get("UPSTASH_REDIS_REST_TOKEN")!,
        });
        console.log("Connected to Redis");
        return redis;
    } catch (error) {
        console.log(error);
    }
}

export { createRedisConnection, redis };
