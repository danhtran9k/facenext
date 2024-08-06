import { validateRequest } from "@core/lucia-auth";
import prisma from "@core/prisma";
import { postDataInclude } from "@core/prisma/post.query";

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
