import { TrendsSidebar } from "@module/app-global/trend-sidebar";
import { CreatePostEditor } from "@module/create-post";
import { ForYouFeedClient, ForYouFeedServer } from "@module/for-you-feed";

const CLIENT_MODE = true;

export default function Home() {
  // min-w-0 to shrink auto width
  return (
    <main className="flex w-full min-w-0 gap-5">
      <div className="w-full min-w-0 space-y-5">
        <CreatePostEditor />
        {CLIENT_MODE ? <ForYouFeedClient /> : <ForYouFeedServer />}
      </div>
      <TrendsSidebar />
    </main>
  );
}
