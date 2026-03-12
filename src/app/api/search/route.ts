import { validateRequestFast } from "@/auth";
import { logPerf, jsonWithPerf } from "@/lib/perf";
import prisma from "@/lib/prisma";
import { getFeedPostSelect, PostsPage } from "@/lib/types";
import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  const routeStart = performance.now();

  try {
    const q = req.nextUrl.searchParams.get("q")?.trim() ?? "";
    const cursor = req.nextUrl.searchParams.get("cursor") ?? undefined;

    if (!q) {
      const totalMs = performance.now() - routeStart;
      logPerf("/api/search", {
        status: 200,
        totalMs,
        postCount: 0,
      });

      return jsonWithPerf(
        { posts: [], nextCursor: null } satisfies PostsPage,
        { status: 200 },
        [{ name: "total", durationMs: totalMs }],
      );
    }

    const searchQuery = q.split(/\s+/).join(" & ");
    const pageSize = 5;

    const authStart = performance.now();
    const { userId } = await validateRequestFast();
    const authMs = performance.now() - authStart;

    if (!userId) {
      const totalMs = performance.now() - routeStart;
      logPerf("/api/search", {
        status: 401,
        totalMs,
        authMs,
      });

      return jsonWithPerf(
        { error: "Unauthorized" },
        { status: 401 },
        [
          { name: "auth", durationMs: authMs },
          { name: "total", durationMs: totalMs },
        ],
      );
    }

    const dbStart = performance.now();
    const posts = await prisma.post.findMany({
      where: {
        OR: [
          {
            content: {
              search: searchQuery,
            },
          },
          {
            user: {
              displayName: {
                search: searchQuery,
              },
            },
          },
          {
            user: {
              username: {
                search: searchQuery,
              },
            },
          },
        ],
      },
      select: getFeedPostSelect(userId),
      orderBy: { createdAt: "desc" },
      take: pageSize + 1,
      cursor: cursor ? { id: cursor } : undefined,
    });
    const dbMs = performance.now() - dbStart;

    const nextCursor = posts.length > pageSize ? posts[pageSize].id : null;

    const data: PostsPage = {
      posts: posts.slice(0, pageSize),
      nextCursor,
    };

    const totalMs = performance.now() - routeStart;
    logPerf("/api/search", {
      status: 200,
      totalMs,
      authMs,
      dbMs,
      postCount: data.posts.length,
    });

    return jsonWithPerf(data, { status: 200 }, [
      { name: "auth", durationMs: authMs },
      { name: "db", durationMs: dbMs },
      { name: "total", durationMs: totalMs },
    ]);
  } catch (error) {
    const totalMs = performance.now() - routeStart;
    logPerf("/api/search", {
      status: 500,
      totalMs,
      error: error instanceof Error ? error.message : String(error),
    });
    console.error(error);

    return jsonWithPerf(
      { error: "Internal server error" },
      { status: 500 },
      [{ name: "total", durationMs: totalMs }],
    );
  }
}
