import { QueryKey, useMutation, useQueryClient } from "@tanstack/react-query";

import { deleteComment } from "@app/api/posts/[postId]/comment/comment-delete.action";
import { InfinityComment } from "@app/api/posts/[postId]/comment/comment.dto";

import { useToast } from "@core/app-shadcn/use-toast";

const setQueryData = (
  oldData: InfinityComment | undefined,
  deletedCommentId: string,
) => {
  if (!oldData) return;
  const newPages = oldData.pages.map(page => ({
    previousCursor: page.previousCursor,
    comments: page.comments.filter(c => c.id !== deletedCommentId),
  }));

  return {
    pageParams: oldData.pageParams,
    pages: newPages,
  };
};

export function useDeleteComment() {
  const { toast } = useToast();

  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: deleteComment,
    onSuccess: async deletedComment => {
      const queryKey: QueryKey = ["comment", deletedComment.postId];

      await queryClient.cancelQueries({ queryKey });

      queryClient.setQueryData<InfinityComment>(queryKey, oldData =>
        setQueryData(oldData, deletedComment.id),
      );

      toast({
        description: "Comment deleted",
      });
    },
    onError(error) {
      console.error(error);
      toast({
        variant: "destructive",
        description: "Failed to delete comment. Please try again.",
      });
    },
  });

  return mutation;
}
