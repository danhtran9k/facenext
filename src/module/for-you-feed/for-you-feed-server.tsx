import { validateRequest } from "@app/api/_core/lucia-auth";
import prisma from "@app/api/_core/prisma";
import { postDataInclude } from "@app/api/posts/post.query";

import { PostItem } from "@module/post-item";

export const ForYouFeedServer = async () => {
  const { user } = await validateRequest();
  if (!user) return null;

  // Fetch posts
  const posts = await prisma.post.findMany({
    include: postDataInclude(user.id),
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
