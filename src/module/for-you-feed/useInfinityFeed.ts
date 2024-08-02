import { InfiniteData, useInfiniteQuery } from "@tanstack/react-query";

import kyInstance from "@core/ky";
import { PostsPage } from "@core/prisma/post.prisma";

type StringOrNull = string | null;
type TFetchFeed = { pageParam: StringOrNull };

const fetchFeedInfinite = async ({ pageParam }: TFetchFeed) =>
  kyInstance
    .get(
      "/api/posts/for-you",
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
    queryKey: ["post-feed", "for-you"],
    queryFn: fetchFeedInfinite,
    initialPageParam: null as StringOrNull,
    getNextPageParam: lastPage => lastPage.nextCursor,
    select,
  });
};
