import { InfiniteData, useInfiniteQuery } from "@tanstack/react-query";

import kyInstance from "@core/ky";
import { PostCursor, PostsPage } from "@core/prisma/post.prisma";

type TFetchFeed = { pageParam: PostCursor };

const fetchFeedFollowing = async ({ pageParam }: TFetchFeed) =>
  kyInstance
    .get(
      "/api/posts/for-you",
      pageParam
        ? { searchParams: { cursor: pageParam, limit: 4 } }
        : { searchParams: { limit: 4 } },
    )
    .json<PostsPage>();

export const useInfinityFeedFollowing = <TData = InfiniteData<PostsPage>>(
  select?: (data: InfiniteData<PostsPage>) => TData,
) => {
  return useInfiniteQuery({
    queryKey: ["post-feed", "for-you"],
    queryFn: fetchFeedFollowing,
    initialPageParam: null as PostCursor,
    getNextPageParam: lastPage => lastPage.nextCursor,
    select,
  });
};
