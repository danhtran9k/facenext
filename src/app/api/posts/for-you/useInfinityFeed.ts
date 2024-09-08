import { InfiniteData, useInfiniteQuery } from "@tanstack/react-query";

import { TFetchFeed } from "@app/api/_core/api.common";
import kyInstance from "@app/api/_core/ky";
import { keysPostFeed } from "@app/api/_core/queryKey";

import { PostCursor, PostsPage } from "@app/api/posts/post.prisma";

const fetchFeedInfinite = async ({ pageParam }: TFetchFeed) =>
  kyInstance
    .get(
      keysPostFeed.forYou.api,
      pageParam
        ? { searchParams: { cursor: pageParam, limit: 4 } }
        : { searchParams: { limit: 4 } },
    )
    .json<PostsPage>();

// https://tanstack.com/query/latest/docs/framework/react/guides/infinite-queries#example
export const useInfinityFeed = <TData = InfiniteData<PostsPage>>(
  select?: (data: InfiniteData<PostsPage>) => TData,
) => {
  return useInfiniteQuery({
    queryKey: keysPostFeed.forYou.key(),
    queryFn: fetchFeedInfinite,
    initialPageParam: null as PostCursor,
    getNextPageParam: lastPage => lastPage.nextCursor,
    select,
  });
};
