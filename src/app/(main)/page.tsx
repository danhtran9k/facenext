import prisma from "@core/prisma";
import { postDataInclude } from "@core/prisma/post.prisma";

import { TrendsSidebar } from "@module/app-global/trend-sidebar";
import { CreatePostEditor } from "@module/create-post";
import { PostItem } from "@module/post-item";

export default async function Home() {
  const posts = await prisma.post.findMany({
    include: postDataInclude,
    orderBy: { createdAt: "desc" },
  });

  // min-w-0 to shrink auto width
  return (
    <main className="flex w-full min-w-0 gap-5">
      <div className="w-full min-w-0 space-y-5">
        <CreatePostEditor />
        {posts.map(post => (
          <PostItem key={post.id} post={post} />
        ))}
      </div>
      <TrendsSidebar />
    </main>
  );
}
