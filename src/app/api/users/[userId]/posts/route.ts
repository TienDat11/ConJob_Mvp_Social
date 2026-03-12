import { validateRequestFast } from "@/auth";
import { logPerf, jsonWithPerf } from "@/lib/perf";
import prisma from "@/lib/prisma";
import { getFeedPostSelect, PostsPage } from "@/lib/types";
import { NextRequest } from "next/server";

export async function GET(
  req: NextRequest,
  { params: { userId } }: { params: { userId: string } },
) {
  const routeStart = performance.now();

  try {
    const cursor = req.nextUrl.searchParams.get("cursor") ?? undefined;
    const pageSize = 4;

    const authStart = performance.now();
    const { userId: loggedInUserId } = await validateRequestFast();
    const authMs = performance.now() - authStart;

    if (!loggedInUserId) {
      const totalMs = performance.now() - routeStart;
      logPerf(`/api/users/${userId}/posts`, {
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
      where: { userId },
      select: getFeedPostSelect(loggedInUserId),
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
    logPerf(`/api/users/${userId}/posts`, {
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
    logPerf(`/api/users/${userId}/posts`, {
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
