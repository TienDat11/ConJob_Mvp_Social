"use client";

import InfiniteScrollContainer from "@/components/InfiniteScrollContainer";
import Post from "@/components/posts/Post";
import PostsLoadingSkeleton from "@/components/posts/PostsLoadingSkeleton";
import { Button } from "@/components/ui/button";
import { PAGE_SIZE_AFTER_CACHE, PAGE_SIZE_FIRST_LOAD } from "@/constant/constant";
import kyInstance from "@/lib/ky";
import { PostsPage } from "@/lib/types";
import { useInfiniteQuery, useQueryClient } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";

export default function ForYouFeed() {
  const queryClient = useQueryClient();

  const cachedPages = queryClient.getQueryData<{ pages: PostsPage[] }>([
    "post-feed",
    "for-you",
  ])?.pages;

  const postsFromCache = cachedPages?.flatMap((page) => page.posts) || [];
  const isFirstLoad = !cachedPages; 


  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetching,
    isFetchingNextPage,
    status,
  } = useInfiniteQuery({
    queryKey: ["post-feed", "for-you"],
    queryFn: ({ pageParam, meta }): Promise<PostsPage> =>
      kyInstance
        .get(
          "/api/posts/for-you",
          { searchParams: { cursor: pageParam ?? '' , pageSize: isFirstLoad ? PAGE_SIZE_FIRST_LOAD : PAGE_SIZE_AFTER_CACHE, } }
        )
        .json<PostsPage>(),
    initialPageParam: null as string | null,
    getNextPageParam: (lastPage) => lastPage.nextCursor,
    enabled: isFirstLoad,
  });

  const posts = isFirstLoad ? data?.pages.flatMap((page) => page.posts) || [] : postsFromCache;

  if (status === "pending") {
    return <PostsLoadingSkeleton />;
  }

  if (status === "success" && !posts.length && !hasNextPage) {
    return (
    <div className="text-center text-muted-foreground">
      <p>No one has posted anything yet.</p>
      <Button
        className="mt-3 px-4 py-2 bg-blue-500 text-white rounded"
        onClick={() => {
          const editor = document.getElementById("post-editor");
          if (editor) editor.scrollIntoView({ behavior: "smooth" });
        }}
      >
        Create your first post
      </Button>
    </div>
    );
  }

  if (status === "error") {
    return (
      <p className="text-center text-destructive">
        An error occurred while loading posts.
      </p>
    );
  }

  return (
    <InfiniteScrollContainer
      className="space-y-5"
      onBottomReached={() => hasNextPage && !isFetching && fetchNextPage()}
    >
      {posts.map((post) => (
        <Post key={post.id} post={post} />
      ))}
      {isFetchingNextPage && <Loader2 className="mx-auto my-3 animate-spin" />}
    </InfiniteScrollContainer>
  );
}
