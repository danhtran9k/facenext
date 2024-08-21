import { InfiniteData, useInfiniteQuery } from "@tanstack/react-query";

import { TFetchFeed } from "@app/api/_core/api.common";
import kyInstance from "@app/api/_core/ky";
import { keysPostFeed } from "@app/api/_core/queryKey";
import { PostCursor, PostsPage } from "@app/api/posts/post.prisma";

const fetchFeedFollowing = async ({ pageParam }: TFetchFeed) =>
  kyInstance
    .get(
      keysPostFeed.following.api,
      pageParam
        ? { searchParams: { cursor: pageParam, limit: 4 } }
        : { searchParams: { limit: 4 } },
    )
    .json<PostsPage>();

export const useInfinityFeedFollowing = <TData = InfiniteData<PostsPage>>(
  select?: (data: InfiniteData<PostsPage>) => TData,
) => {
  return useInfiniteQuery({
    queryKey: keysPostFeed.following.key(),
    queryFn: fetchFeedFollowing,
    initialPageParam: null as PostCursor,
    getNextPageParam: lastPage => lastPage.nextCursor,
    select,
  });
};
