import {
  QueryFilters,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { useRouter } from "next/navigation";

import { keysPostFeed } from "@app/api/_core/queryKey";
import { InfinityPost } from "@app/api/posts/post.prisma";

import { useToast } from "@core/app-shadcn/use-toast";

import { useUploadThing } from "@module/app-common/uploadthing.ts";

import { updateUserProfile } from "./update-user-profile.action";
import { UpdateUserProfileValues } from "./update-user-profile.dto";

type TMutatePayload = {
  values: UpdateUserProfileValues;
  avatar?: File;
};

const useMutateFn = () => {
  const { startUpload: startAvatarUpload } = useUploadThing("avatar");

  return ({ values, avatar }: TMutatePayload) =>
    Promise.all([
      updateUserProfile(values),
      avatar && startAvatarUpload([avatar]),
    ]);
};

type TUseMutateFn = ReturnType<typeof useMutateFn>;
type TUseMutateFnResult = Awaited<ReturnType<TUseMutateFn>>;

const updatePostAfterProfileUpdate = (
  oldData: InfinityPost | undefined,
  updatedUser: any,
  newAvatarUrl: string | undefined,
) => {
  if (!oldData) return;

  const userUpdated = {
    ...updatedUser,
    avatarUrl: newAvatarUrl || updatedUser.avatarUrl,
  };

  const newPage = oldData.pages.map(page => {
    const newPosts = page.posts.map(post => {
      return post.user.id === updatedUser.id
        ? {
            ...post,
            user: userUpdated,
          }
        : post;
    });

    return {
      nextCursor: page.nextCursor,
      posts: newPosts,
    };
  });

  return {
    pageParams: oldData.pageParams,
    pages: newPage,
  };
};

const useOnSuccess = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const router = useRouter();

  return async ([updatedUser, uploadResult]: TUseMutateFnResult) => {
    const newAvatarUrl = uploadResult?.[0].serverData.avatarUrl;

    const queryFilter: QueryFilters = {
      queryKey: keysPostFeed.key,
    };

    await queryClient.cancelQueries(queryFilter);

    queryClient.setQueriesData<InfinityPost>(queryFilter, oldData =>
      updatePostAfterProfileUpdate(oldData, updatedUser, newAvatarUrl),
    );

    // Vì có nhiều part của page là server component nên phải soft-refresh lại
    router.refresh();

    toast({
      description: "Profile updated",
    });
  };
};

export function useUpdateProfileMutation() {
  const { toast } = useToast();
  const mutationFn = useMutateFn();
  const onSuccess = useOnSuccess();

  const mutation = useMutation({
    mutationFn,
    onSuccess,
    onError(error) {
      console.error(error);
      toast({
        variant: "destructive",
        description: "Failed to update profile. Please try again.",
      });
    },
  });

  return mutation;
}
