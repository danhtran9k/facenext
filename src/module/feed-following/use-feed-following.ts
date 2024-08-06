import { InfiniteData, useInfiniteQuery } from "@tanstack/react-query";

import kyInstance from "@core/ky";
import { PostsPage } from "@core/prisma/post.prisma";

type StringOrNull = string | null;
type TFetchFeed = { pageParam: StringOrNull };

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
    initialPageParam: null as StringOrNull,
    getNextPageParam: lastPage => lastPage.nextCursor,
    select,
  });
};
