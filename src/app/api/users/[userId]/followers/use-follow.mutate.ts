import { QueryKey, useMutation, useQueryClient } from "@tanstack/react-query";

import kyInstance from "@app/api/_core/ky";
import { keysFollowInfo } from "@app/api/_core/queryKey";
import { FollowerInfo } from "@app/api/posts/post.prisma";

import { useToast } from "@core/app-shadcn/use-toast";

const mutateFollow = (isFollowedByUser: boolean, userId: string) => () => {
  return isFollowedByUser
    ? kyInstance.delete(keysFollowInfo.api(userId))
    : kyInstance.post(keysFollowInfo.api(userId));
};

// https://tanstack.com/query/latest/docs/reference/QueryClient#queryclientsetquerydata
// Có thể viết để nhận prevState lấy từ trước
const optimisticUpdate = (previousState: FollowerInfo | undefined) => {
  return {
    followers:
      (previousState?.followers || 0) +
      (previousState?.isFollowedByUser ? -1 : 1),
    isFollowedByUser: !previousState?.isFollowedByUser,
  };
};

export function useFollowMutate(isFollowedByUser: boolean, userId: string) {
  const queryClient = useQueryClient();
  const queryKey: QueryKey = keysFollowInfo.key(userId);
  const { toast } = useToast();

  const mutate = useMutation({
    mutationFn: mutateFollow(isFollowedByUser, userId),
    // https://tanstack.com/query/v4/docs/framework/react/reference/useMutation
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey });
      const previousState = queryClient.getQueryData<FollowerInfo>(queryKey);

      // Thử 2 style
      queryClient.setQueryData<FollowerInfo>(queryKey, optimisticUpdate);
      // queryClient.setQueryData<FollowerInfo>(queryKey, () =>
      //   optimisticUpdate(previousState),
      // );

      // Trả về context để revert trong trường hợp lỗi
      return { previousState };
    },
    onError(error, variables, context) {
      queryClient.setQueryData(queryKey, context?.previousState);
      console.error(error);
      toast({
        variant: "destructive",
        description: "Something went wrong. Please try again.",
      });
    },
  });

  return mutate;
}
