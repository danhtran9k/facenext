import { useMutation, useQueryClient } from "@tanstack/react-query";

import kyInstance from "@app/api/_core/ky";
import { postIdBookmarkQueryKey } from "@app/api/posts/[postId]/bookmark/use-postId-bookmark";
import { BookmarkInfo } from "@app/api/posts/post.prisma";

import { useToast } from "@core/app-shadcn/use-toast";

export const usePostIdBookmarkMutate = (
  postId: string,
  isBookmarkedByUser: boolean,
) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const queryKey = postIdBookmarkQueryKey(postId);

  const mutate = useMutation({
    mutationFn: () =>
      isBookmarkedByUser
        ? kyInstance.delete(`/api/posts/${postId}/bookmark`)
        : kyInstance.post(`/api/posts/${postId}/bookmark`),
    onMutate: async () => {
      toast({
        description: `Post ${isBookmarkedByUser ? "un" : ""}bookmarked`,
      });

      await queryClient.cancelQueries({ queryKey });

      const previousState = queryClient.getQueryData<BookmarkInfo>(queryKey);

      // Chỗ này cũng phải dùng predicate giống create-post mới đúng
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
