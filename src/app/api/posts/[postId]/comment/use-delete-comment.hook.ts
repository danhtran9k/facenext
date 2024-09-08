import { QueryKey, useMutation, useQueryClient } from "@tanstack/react-query";

import { useToast } from "@core/app-shadcn/use-toast";

import { keysComment, keysPostFeed } from "@app/api/_core/queryKey";

import { deleteComment } from "@app/api/posts/[postId]/comment/comment-delete.action";
import { InfinityComment } from "@app/api/posts/[postId]/comment/comment.dto";
import { setCommentCount } from "@app/api/posts/[postId]/comment/set-comment-count.helper";
import { InfinityPost } from "@app/api/posts/post.prisma";

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
      const queryKey: QueryKey = keysComment.key(deletedComment.postId);

      await queryClient.cancelQueries({ queryKey });

      queryClient.setQueryData<InfinityComment>(queryKey, oldData =>
        setQueryData(oldData, deletedComment.id),
      );

      queryClient.setQueriesData<InfinityPost>(
        // vì comment có thể vào bất kì post-feed nào
        // -> ko predicate như create với delete post
        { queryKey: keysPostFeed.key },
        oldData => setCommentCount(oldData, deletedComment.postId, -1),
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
