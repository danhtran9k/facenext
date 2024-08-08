import { InfiniteData, useInfiniteQuery } from "@tanstack/react-query";

import kyInstance from "@app/api/_core/ky";
import { PostCursor, PostsPage } from "@app/api/posts/post.prisma";

type TFetchFeed = { pageParam: PostCursor };

const fetchFeedFollowing = async ({ pageParam }: TFetchFeed) =>
  kyInstance
    .get(
      "/api/posts/following",
      pageParam
        ? { searchParams: { cursor: pageParam, limit: 4 } }
        : { searchParams: { limit: 4 } },
    )
    .json<PostsPage>();

export const useInfinityFeedFollowing = <TData = InfiniteData<PostsPage>>(
  select?: (data: InfiniteData<PostsPage>) => TData,
) => {
  return useInfiniteQuery({
    queryKey: ["post-feed", "following"],
    queryFn: fetchFeedFollowing,
    initialPageParam: null as PostCursor,
    getNextPageParam: lastPage => lastPage.nextCursor,
    select,
  });
};
