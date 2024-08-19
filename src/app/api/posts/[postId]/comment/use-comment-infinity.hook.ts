import { useInfiniteQuery } from "@tanstack/react-query";

import kyInstance from "@app/api/_core/ky";
import {
  CommentCursor,
  CommentsPage,
  InfinityComment,
} from "@app/api/posts/[postId]/comment/comment.dto";

const postCommnentQueryFn =
  (postId: string) =>
  ({ pageParam }: { pageParam: CommentCursor }) =>
    kyInstance
      .get(
        `/api/posts/${postId}/comment`,
        pageParam ? { searchParams: { cursor: pageParam } } : {},
      )
      .json<CommentsPage>();

export const usePostCommentInfinity = <TData = InfinityComment | undefined>(
  postId: string,
  select?: (data: InfinityComment) => TData,
) => {
  const query = useInfiniteQuery({
    queryKey: ["comment", postId],
    queryFn: postCommnentQueryFn(postId),
    initialPageParam: null as CommentCursor,
    getNextPageParam: firstPage => firstPage.previousCursor,
    select: data => {
      // https://tanstack.com/query/latest/docs/framework/react/guides/migrating-to-react-query-3#useinfinitequery-is-now-bi-directional
      // https://tanstack.com/query/latest/docs/framework/react/guides/infinite-queries#what-if-i-want-to-show-the-pages-in-reversed-order
      const comment = {
        pages: [...data.pages].reverse(),
        pageParams: [...data.pageParams].reverse(),
      };
      return select ? select(comment) : (comment as TData);
    },
  });

  return query;
};
