import PostEditor from "@/components/posts/editor/PostEditor";
import TrendsSidebar from "@/components/TrendsSidebar";
import PostsLoadingSkeleton from "@/components/posts/PostsLoadingSkeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import dynamic from "next/dynamic";

const FollowingFeeds = dynamic(() => import ("./FollowingFeed"), {
  ssr: false,
  loading: () => <PostsLoadingSkeleton />
})

const ForYouFeed = dynamic(() => import ("./ForYouFeed"), {
  ssr: false,
  loading: () => <PostsLoadingSkeleton />
})

export default function Home() {
  return (
    <main className="flex w-full min-w-0 gap-3">
      <div className="w-full min-w-0 space-y-3">
        <PostEditor />
        <Tabs defaultValue ="for-you">
          <TabsList>
          <TabsTrigger value="for-you">
            For you
          </TabsTrigger>
          <TabsTrigger value="following">
            Following
          </TabsTrigger>
          </TabsList>
          <TabsContent value = "for-you">
            <ForYouFeed/>
          </TabsContent>
          <TabsContent value = "following">
            <FollowingFeeds/>
          </TabsContent>
        </Tabs>
      </div>
      <TrendsSidebar />
    </main>
  );
}
