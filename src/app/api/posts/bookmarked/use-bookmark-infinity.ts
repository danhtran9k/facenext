import { useInfiniteQuery } from "@tanstack/react-query";

import { TFetchFeed } from "@app/api/_core/api.common";
import kyInstance from "@app/api/_core/ky";
import { PostsPage } from "@app/api/posts/post.prisma";

const queryFn = ({ pageParam }: TFetchFeed) =>
  kyInstance
    .get(
      "/api/posts/bookmarked",
      pageParam ? { searchParams: { cursor: pageParam } } : {},
    )
    .json<PostsPage>();

export const useBookmarkInfinity = () => {
  const query = useInfiniteQuery({
    queryKey: ["post-feed", "bookmarks"],
    queryFn: queryFn,
    initialPageParam: null as string | null,
    getNextPageParam: lastPage => lastPage.nextCursor,
  });

  return query;
};
