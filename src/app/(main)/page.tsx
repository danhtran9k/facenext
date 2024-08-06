import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@module/app-shadcn/tabs";

import { TrendsSidebar } from "@module/app-global/trend-sidebar";
import { FeedFollowing } from "@module/feed-following";
import { ForYouFeedClient, ForYouFeedServer } from "@module/for-you-feed";
import { CreatePostEditor } from "@module/post-create";

const CLIENT_MODE = true;

export default function Home() {
  const tabItemClass =
    "flex-1 hover:bg-background data-[state=active]:font-bold data-[state=active]:text-foreground";

  // min-w-0 to shrink auto width
  return (
    <main className="flex w-full min-w-0 gap-5">
      <div className="w-full min-w-0 space-y-5">
        <CreatePostEditor />
        <Tabs defaultValue="for-you">
          <TabsList className="h-12 w-full gap-1 bg-card shadow-sm">
            <TabsTrigger value="for-you" className={tabItemClass}>
              For you
            </TabsTrigger>
            <TabsTrigger value="following" className={tabItemClass}>
              Following
            </TabsTrigger>
          </TabsList>
          <TabsContent value="for-you">
            {CLIENT_MODE ? <ForYouFeedClient /> : <ForYouFeedServer />}
          </TabsContent>
          <TabsContent value="following">
            <FeedFollowing />
          </TabsContent>
        </Tabs>
      </div>
      <TrendsSidebar />
    </main>
  );
}
