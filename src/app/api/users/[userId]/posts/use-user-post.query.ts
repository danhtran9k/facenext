import { InfiniteData, useInfiniteQuery } from "@tanstack/react-query";

import { TFetchFeed } from "@app/api/_core/api.common";
import kyInstance from "@app/api/_core/ky";
import { PostCursor, PostsPage } from "@app/api/posts/post.prisma";

const fetchMyFeed =
  (userId: string) =>
  async ({ pageParam }: TFetchFeed) =>
    kyInstance
      .get(
        `/api/users/${userId}/posts`,
        pageParam
          ? { searchParams: { cursor: pageParam, limit: 4 } }
          : { searchParams: { limit: 4 } },
      )
      .json<PostsPage>();

export const useUserPost = <TData = InfiniteData<PostsPage>>(
  userId: string,
  select?: (data: InfiniteData<PostsPage>) => TData,
) => {
  const mutate = useInfiniteQuery({
    queryKey: ["post-feed", "user-posts", userId],
    queryFn: fetchMyFeed(userId),
    initialPageParam: null as PostCursor,
    getNextPageParam: lastPage => lastPage.nextCursor,
    select,
  });

  return mutate;
};
