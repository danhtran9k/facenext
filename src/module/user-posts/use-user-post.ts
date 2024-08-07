import { InfiniteData, useInfiniteQuery } from "@tanstack/react-query";

import kyInstance from "@core/ky";
import { PostsPage } from "@core/prisma/post.prisma";

type StringOrNull = string | null;
type TFetchFeed = { pageParam: StringOrNull };

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
    initialPageParam: null as StringOrNull,
    getNextPageParam: lastPage => lastPage.nextCursor,
    select,
  });

  return mutate;
};
