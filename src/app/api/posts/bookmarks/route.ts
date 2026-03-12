import { validateRequestFast } from "@/auth";
import { logPerf, jsonWithPerf } from "@/lib/perf";
import prisma from "@/lib/prisma";
import { getFeedPostSelect, PostsPage } from "@/lib/types";
import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  const routeStart = performance.now();

  try {
    const cursor = req.nextUrl.searchParams.get("cursor") || undefined;
    const pageSize = 4;

    const authStart = performance.now();
    const { userId } = await validateRequestFast();
    const authMs = performance.now() - authStart;

    if (!userId) {
      const totalMs = performance.now() - routeStart;
      logPerf("/api/posts/bookmarks", {
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
    const bookmarks = await prisma.bookmark.findMany({
      where: {
        userId,
      },
      select: {
        id: true,
        post: {
          select: getFeedPostSelect(userId),
        },
      },
      orderBy: {
        createdAt: "desc",
      },
      take: pageSize + 1,
      cursor: cursor ? { id: cursor } : undefined,
    });
    const dbMs = performance.now() - dbStart;

    const nextCursor = bookmarks.length > pageSize ? bookmarks[pageSize].id : null;

    const data: PostsPage = {
      posts: bookmarks.slice(0, pageSize).map((bookmark) => bookmark.post),
      nextCursor,
    };

    const totalMs = performance.now() - routeStart;
    logPerf("/api/posts/bookmarks", {
      status: 200,
      totalMs,
      authMs,
      dbMs,
      pageSize,
      postCount: data.posts.length,
    });

    return jsonWithPerf(data, { status: 200 }, [
      { name: "auth", durationMs: authMs },
      { name: "db", durationMs: dbMs },
      { name: "total", durationMs: totalMs },
    ]);
  } catch (error) {
    const totalMs = performance.now() - routeStart;
    logPerf("/api/posts/bookmarks", {
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
