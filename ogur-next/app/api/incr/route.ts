import { redis } from "@/lib/redis";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const slug = body.slug;

        if (!slug) {
            return NextResponse.json({ error: "Slug is required" }, { status: 400 });
        }

        const key = ["pageviews", "projects", slug].join(":");

        const redisClient = redis();
        if (redisClient.status !== "ready") {
            await redisClient.connect();
        }

        await redisClient.incr(key);

        return NextResponse.json({ success: true }, { status: 200 });
    } catch (error) {
        console.error("Error incrementing view:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}