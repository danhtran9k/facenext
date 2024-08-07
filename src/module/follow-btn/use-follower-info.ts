import { useQuery } from "@tanstack/react-query";

import kyInstance from "@core/ky";
import { FollowerInfo } from "@core/prisma/post.prisma";

export function useFollowerInfo(userId: string, initialState: FollowerInfo) {
  const query = useQuery({
    queryKey: ["follower-info", userId],
    queryFn: () =>
      kyInstance.get(`/api/users/${userId}/followers`).json<FollowerInfo>(),
    initialData: initialState,
    // ko auto nhảy số like và follow -> bad UX
    staleTime: Infinity,
  });

  return query;
}
