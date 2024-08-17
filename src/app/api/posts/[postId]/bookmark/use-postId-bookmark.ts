import { QueryKey, useQuery } from "@tanstack/react-query";

import kyInstance from "@app/api/_core/ky";
import { BookmarkInfo } from "@app/api/posts/post.prisma";

export const postIdBookmarkQueryKey = (postId: string): QueryKey => [
  "bookmark-info",
  postId,
];

export const usePostIdBookmark = (
  postId: string,
  initialState: BookmarkInfo,
) => {
  const query = useQuery({
    queryKey: postIdBookmarkQueryKey(postId),
    queryFn: () =>
      kyInstance.get(`/api/posts/${postId}/bookmark`).json<BookmarkInfo>(),
    initialData: initialState,
    staleTime: Infinity,
  });

  return query;
};
