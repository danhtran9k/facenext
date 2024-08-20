import { InfinityPost } from "@app/api/posts/post.prisma";

export const setCommentCount = (
  oldData: InfinityPost | undefined,
  postId: string,
  increase = 0,
) => {
  if (!oldData) return oldData;

  const newData = oldData.pages.map(page => {
    return {
      ...page,
      posts: page.posts.map(post => {
        if (post.id !== postId) return post;

        const newCount = {
          ...post._count,
          comments: post._count.comments + increase,
        };

        return {
          ...post,
          _count: newCount,
        };
      }),
    };
  });

  return {
    ...oldData,
    pages: newData,
  };
};
