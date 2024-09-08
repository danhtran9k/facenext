import { useInfiniteQuery } from "@tanstack/react-query";

import { TFetchFeed } from "@app/api/_core/api.common";
import kyInstance from "@app/api/_core/ky";
import { keysPostFeed } from "@app/api/_core/queryKey";

import { PostCursor, PostsPage } from "@app/api/posts/post.prisma";

const queryFn = ({ pageParam }: TFetchFeed) =>
  kyInstance
    .get(
      keysPostFeed.bookmarks.api,
      pageParam ? { searchParams: { cursor: pageParam } } : {},
    )
    .json<PostsPage>();

export const useBookmarkInfinity = () => {
  const query = useInfiniteQuery({
    queryKey: keysPostFeed.bookmarks.key(),
    queryFn: queryFn,
    initialPageParam: null as PostCursor,
    getNextPageParam: lastPage => lastPage.nextCursor,
    staleTime: 1000,
  });

  return query;
};
