import prisma from "@core/prisma";
import { postDataInclude } from "@core/prisma/post.prisma";

import { PostItem } from "@module/post-item";

export const ForYouFeedServer = async () => {
  // Fetch posts
  const posts = await prisma.post.findMany({
    include: postDataInclude,
    orderBy: { createdAt: "desc" },
  });

  // Return posts
  return (
    <>
      {posts.map(post => (
        <PostItem key={post.id} post={post} />
      ))}
    </>
  );
};
