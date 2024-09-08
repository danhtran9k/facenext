import {
  QueryFilters,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { usePathname, useRouter } from "next/navigation";

import { useToast } from "@core/app-shadcn/use-toast";
import { PATH_URL } from "@core/path.const";

import { keysPostFeed } from "@app/api/_core/queryKey";

import { InfinityPost } from "@app/api/posts/post.prisma";

import { deletePost } from "./delete-post.action";

function updateQueriesDataAfterDelete(
  oldData: InfinityPost | undefined,
  deletedPostId: string,
): InfinityPost | undefined {
  if (!oldData) return oldData;

  return {
    ...oldData,
    pages: oldData.pages.map(page => ({
      ...page,
      posts: page.posts.filter(p => p.id !== deletedPostId),
    })),
  };
}

export function useDeletePostMutation() {
  const { toast } = useToast();
  const pathname = usePathname();
  const queryClient = useQueryClient();

  // Chú ý dùng next/navigation thay vì next/router
  const router = useRouter();

  const mutation = useMutation({
    mutationFn: deletePost,
    onError: error => {
      console.log("🚀 ~ useDeletePostMutation ~ error:", error);
      toast({
        variant: "destructive",
        description: "Failed to delete post. Please try again.",
      });
    },
    onSuccess: async deletedPost => {
      toast({
        description: "Post deleted",
      });

      const queryFilter: QueryFilters = {
        queryKey: keysPostFeed.key,
      };

      await queryClient.cancelQueries(queryFilter);

      queryClient.setQueriesData<InfinityPost>(queryFilter, oldData =>
        updateQueriesDataAfterDelete(oldData, deletedPost.id),
      );

      // ko có post thì ko thể delete được
      // ko phải gọi revalidate query như create vì ko có edge case

      // Nếu đang trong url delete post thì chuyển về user profile
      if (pathname === PATH_URL.postItem(deletedPost.id)) {
        router.push(PATH_URL.userProfile(deletedPost.user.username));
      }
    },
  });

  return mutation;
}
