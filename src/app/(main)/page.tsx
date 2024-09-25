import PostEditor from "@/components/posts/editor/PostEditor";
import TrendsSidebar from "@/components/TrendsSidebar";
import ForYouFeed from "./ForYouFeed";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import FollowingFeeds from "./FollowingFeed";

export default function Home() {
  return (
    <main className="flex w-full min-w-0 gap-3">
      <div className="w-full min-w-0 space-y-3">
        <PostEditor />
        <Tabs defaultValue = "for-you">
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
