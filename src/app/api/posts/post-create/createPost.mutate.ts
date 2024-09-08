import { useMutation, useQueryClient } from "@tanstack/react-query";

import { useSession } from "@core/app-provider";
import { useToast } from "@core/app-shadcn/use-toast";

import { invalidateQueryPostSubmitFilter } from "@app/api/_core/queryKey";

import { InfinityPost } from "@app/api/posts/post.prisma";

import { submitPost } from "./create-post.action";

// có cần directive useClient ko
// vì là hook - ko phải jsx -> pass được ?
export function useSubmitPostMutation() {
  const { toast } = useToast();

  const queryClient = useQueryClient();

  const { user } = useSession();
  const queryFilter = invalidateQueryPostSubmitFilter(user.id);

  const mutation = useMutation({
    mutationFn: submitPost,
    onSuccess: async newPost => {
      // có thể dùng queryClient.invalidateQueries(keysPostFeed.forYou.key)
      // nhưng sẽ phí 1 lần request lên BE lại
      // Đồng thời vì dùng infinite query nên sẽ gọi lại toàn bộ page
      //  => quá tệ

      // Cancel các query đang chạy để tránh bugs racing condition và ko merge page data được
      // Solution trade-off vì thật chất data có khả năng out-sync
      // đánh đổi bằng việc ko thể fetch khớp thật sự 100% với BE nếu quá nhiều user cùng thao tác
      await queryClient.cancelQueries(queryFilter);

      // queries - vì cần modified multiple post later
      // modified post data cache của user profile,
      // vì react query share giữa các tab với nhau
      // Logic delete post sẽ tương tự
      queryClient.setQueriesData<InfinityPost>(queryFilter, oldData => {
        // [[page1], [page2], ... [pageN]]
        const firstPage = oldData?.pages[0];

        if (firstPage) {
          const newFistPage = {
            posts: [newPost, ...firstPage.posts],
            nextCursor: firstPage.nextCursor,
          };

          return {
            pageParams: oldData.pageParams,
            pages: [newFistPage, ...oldData.pages.slice(1)],
          };
        }
      });

      // Edge case khi user thao tác tạo post quá nhanh,
      // 1st page chưa kịp load đã bị cancel query ở trên
      queryClient.invalidateQueries({
        queryKey: queryFilter.queryKey,
        predicate(query) {
          // Nếu data gốc chưa kịp fetch hoặc đang empty thì refetch ok
          // page sẽ refetch - load nhẹ
          return queryFilter.predicate(query) && !query.state.data;
        },
      });

      toast({
        description: "Post created",
      });
    },
    onError(error) {
      console.error(error);
      toast({
        variant: "destructive",
        description: "Failed to post. Please try again.",
      });
    },
  });

  return mutation;
}
