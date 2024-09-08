import { useMutation, useQueryClient } from "@tanstack/react-query";

import { useToast } from "@core/app-shadcn/use-toast";

import kyInstance from "@app/api/_core/ky";
import { keysBookmarksInfo } from "@app/api/_core/queryKey";

import { BookmarkInfo } from "@app/api/posts/post.prisma";

export const usePostIdBookmarkMutate = (
  postId: string,
  isBookmarkedByUser: boolean,
) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const queryKey = keysBookmarksInfo.key(postId);

  const mutate = useMutation({
    mutationFn: () =>
      isBookmarkedByUser
        ? kyInstance.delete(keysBookmarksInfo.api(postId))
        : kyInstance.post(keysBookmarksInfo.api(postId)),
    onMutate: async () => {
      toast({
        description: `Post ${isBookmarkedByUser ? "un" : ""}bookmarked`,
      });

      await queryClient.cancelQueries({ queryKey });

      const previousState = queryClient.getQueryData<BookmarkInfo>(queryKey);

      // ko cần predicate vì trên trang Bookmark sẽ giữ post đó,
      // còn navigate vào page thì staletime default sẽ là 0 hoặc 1s -> check R-Q provider note
      queryClient.setQueryData<BookmarkInfo>(queryKey, () => ({
        isBookmarkedByUser: !previousState?.isBookmarkedByUser,
      }));

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
