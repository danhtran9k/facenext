import { QueryKey, useQuery } from "@tanstack/react-query";

import kyInstance from "@app/api/_core/ky";
import { keysLikeInfo } from "@app/api/_core/queryKey";
import { LikeInfo } from "@app/api/posts/post.prisma";

const likeQueryFn = (postId: string) => () =>
  kyInstance.get(keysLikeInfo.api(postId)).json<LikeInfo>();

export const useLikePostQuery = (postId: string, initialState: LikeInfo) => {
  const queryKey: QueryKey = keysLikeInfo.key(postId);

  const query = useQuery({
    queryKey,
    queryFn: likeQueryFn(postId),
    initialData: initialState,
    staleTime: Infinity,
  });

  return query;
};
