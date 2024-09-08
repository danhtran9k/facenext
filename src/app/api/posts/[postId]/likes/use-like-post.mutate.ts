import { QueryKey, useMutation, useQueryClient } from "@tanstack/react-query";

import { useToast } from "@core/app-shadcn/use-toast";

import kyInstance from "@app/api/_core/ky";
import { keysLikeInfo } from "@app/api/_core/queryKey";

import { LikeInfo } from "@app/api/posts/post.prisma";

const mutateLikeFn = (isLikedByUser: boolean, postId: string) => () => {
  return isLikedByUser
    ? kyInstance.delete(keysLikeInfo.api(postId))
    : kyInstance.post(keysLikeInfo.api(postId));
};

const optimisticUpdate = (previousState: LikeInfo | undefined) => {
  return {
    likes:
      (previousState?.likes || 0) + (previousState?.isLikedByUser ? -1 : 1),
    isLikedByUser: !previousState?.isLikedByUser,
  };
};

export const useLikePost = (postId: string, isLikedByUser: boolean) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const queryKey: QueryKey = keysLikeInfo.key(postId);

  const mutate = useMutation({
    mutationFn: mutateLikeFn(isLikedByUser, postId),
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey });

      const previousState = queryClient.getQueryData<LikeInfo>(queryKey);

      queryClient.setQueryData<LikeInfo>(queryKey, () =>
        optimisticUpdate(previousState),
      );

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
};
