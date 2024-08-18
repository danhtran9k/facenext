import { QueryKey, useQuery } from "@tanstack/react-query";

import kyInstance from "@app/api/_core/ky";
import { BookmarkInfo } from "@app/api/posts/post.prisma";

export const postIdBookmarkQueryKey = (postId: string): QueryKey => [
  "bookmark-info",
  postId,
];

const queryPostIdBookmarkFn = (postId: string) => () =>
  kyInstance.get(`/api/posts/${postId}/bookmark`).json<BookmarkInfo>();

// feedInitialData và staleTime: Infinity
// data thì modified bằng setQueryData => gần như api ko dùng
// => thực tế initial có thể tìm qua post-item sẵn, logic chỗ này ko hay
// be cũng phải cấp 1 api GET endpoint vô nghĩa (vì thực chất là query post rồi mod lại data)
export const usePostIdBookmark = (
  postId: string,
  initialState: BookmarkInfo,
) => {
  const query = useQuery({
    queryKey: postIdBookmarkQueryKey(postId),
    queryFn: queryPostIdBookmarkFn(postId),
    initialData: initialState,
    staleTime: Infinity,
  });

  return query;
};
