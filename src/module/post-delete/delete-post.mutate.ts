import {
  InfiniteData,
  QueryFilters,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { usePathname, useRouter } from "next/navigation";

import { PostsPage } from "@core/prisma/post.prisma";

import { useToast } from "@module/app-shadcn/use-toast";

import { deletePost } from "./delete-post.action";

function updateQueriesDataAfterDelete(
  oldData: InfiniteData<PostsPage, string | null> | undefined,
  deletedPostId: string,
): InfiniteData<PostsPage, string | null> | undefined {
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

      const queryFilter: QueryFilters = { queryKey: ["post-feed"] };

      await queryClient.cancelQueries(queryFilter);

      queryClient.setQueriesData<InfiniteData<PostsPage, string | null>>(
        queryFilter,
        oldData => updateQueriesDataAfterDelete(oldData, deletedPost.id),
      );

      // ko có post thì ko thể delete được
      // ko phải gọi revalidate query như create vì ko có edge case

      // Nếu đang trong url delete post thì chuyển về user profile
      if (pathname === `/posts/${deletedPost.id}`) {
        router.push(`/users/${deletedPost.user.username}`);
      }
    },
  });

  return mutation;
}