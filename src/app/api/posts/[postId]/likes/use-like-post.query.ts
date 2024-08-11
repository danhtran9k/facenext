import { QueryKey, useQuery } from "@tanstack/react-query";

import kyInstance from "@app/api/_core/ky";
import { LikeInfo } from "@app/api/posts/post.prisma";

const likeQueryFn = (postId: string) => () =>
  kyInstance.get(`/api/posts/${postId}/likes`).json<LikeInfo>();

export const useLikePostQuery = (postId: string, initialState: LikeInfo) => {
  const queryKey: QueryKey = ["like-info", postId];

  const query = useQuery({
    queryKey,
    queryFn: likeQueryFn(postId),
    initialData: initialState,
    staleTime: Infinity,
  });

  return query;
};
