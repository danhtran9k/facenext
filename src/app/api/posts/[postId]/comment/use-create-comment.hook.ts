import { QueryKey, useMutation, useQueryClient } from "@tanstack/react-query";

import { keysComment, keysPostFeed } from "@app/api/_core/queryKey";
import {
  submitComment,
  TSubmitComment,
} from "@app/api/posts/[postId]/comment/comment-create.action";
import { InfinityComment } from "@app/api/posts/[postId]/comment/comment.dto";
import { setCommentCount } from "@app/api/posts/[postId]/comment/set-comment-count.helper";
import { InfinityPost } from "@app/api/posts/post.prisma";

import { useToast } from "@core/app-shadcn/use-toast";

const setQueryData = (
  oldData: InfinityComment | undefined,
  newComment: TSubmitComment,
) => {
  const firstPage = oldData?.pages[0];

  if (firstPage) {
    const newFirstPage = {
      previousCursor: firstPage.previousCursor,
      comments: [...firstPage.comments, newComment],
    };

    return {
      pageParams: oldData.pageParams,
      pages: [newFirstPage, ...oldData.pages.slice(1)],
    };
  }
};

export const useCreatePostComment = (postId: string) => {
  const { toast } = useToast();

  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: submitComment,
    onSuccess: async newComment => {
      const queryKey: QueryKey = keysComment.key(postId);

      await queryClient.cancelQueries({ queryKey });

      queryClient.setQueryData<InfinityComment>(queryKey, oldData =>
        setQueryData(oldData, newComment),
      );

      queryClient.setQueriesData<InfinityPost>(
        // vì comment có thể vào bất kì post-feed nào
        // -> ko predicate như create với delete post
        { queryKey: keysPostFeed.key },
        oldData => setCommentCount(oldData, postId, +1),
      );

      // Nếu comment đang empty thì invalidate query để fetch lại
      queryClient.invalidateQueries({
        queryKey,
        predicate(query) {
          return !query.state.data;
        },
      });

      toast({
        description: "Comment created",
      });
    },
    onError(error) {
      console.error(error);
      toast({
        variant: "destructive",
        description: "Failed to submit comment. Please try again.",
      });
    },
  });

  return mutation;
};
