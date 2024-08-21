import { useQuery } from "@tanstack/react-query";

import kyInstance from "@app/api/_core/ky";
import { keysFollowInfo } from "@app/api/_core/queryKey";
import { FollowerInfo } from "@app/api/posts/post.prisma";

export function useFollowerInfo(userId: string, initialState: FollowerInfo) {
  const query = useQuery({
    queryKey: keysFollowInfo.key(userId),
    queryFn: () =>
      kyInstance.get(keysFollowInfo.api(userId)).json<FollowerInfo>(),
    initialData: initialState,
    // ko auto nhảy số like và follow -> bad UX
    staleTime: Infinity,
  });

  return query;
}
