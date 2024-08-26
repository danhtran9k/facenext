import { InfiniteData, useInfiniteQuery } from "@tanstack/react-query";

import kyInstance from "@app/api/_core/ky";
import { keysPostFeed } from "@app/api/_core/queryKey";
import { PostCursor, PostsPage } from "@app/api/posts/post.prisma";

const searchQueryFn =
  (query: string) =>
  ({ pageParam }: { pageParam: PostCursor }) =>
    kyInstance
      .get(keysPostFeed.search.api, {
        searchParams: {
          q: query,
          ...(pageParam ? { cursor: pageParam } : {}),
        },
      })
      .json<PostsPage>();

export const usePostSearchInfinite = <TData = InfiniteData<PostsPage>>(
  query: string,
  select?: (data: InfiniteData<PostsPage>) => TData,
) => {
  const queryInfinity = useInfiniteQuery({
    queryKey: keysPostFeed.search.key(query),
    queryFn: searchQueryFn(query),
    initialPageParam: null as PostCursor,
    getNextPageParam: lastPage => lastPage.nextCursor,
    gcTime: 0,
    select,
  });

  return queryInfinity;
};
