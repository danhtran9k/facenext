"use client";

import { Loader2 } from "lucide-react";

import { useUserPost } from "@app/api/users/[userId]/posts/use-user-post.query";

import InfiniteScrollContainer from "@module/app-common/InfiniteScrollContainer";

import { PostItem, PostsLoadingSkeleton } from "@module/post-item";

interface UserPostsProps {
  userId: string;
}

export function UserPosts({ userId }: UserPostsProps) {
  const {
    data: posts,
    fetchNextPage,
    hasNextPage,
    isFetching,
    isFetchingNextPage,
    status,
  } = useUserPost(
    userId,
    data => data?.pages.flatMap(page => page.posts) || [],
  );

  if (status === "pending") {
    return <PostsLoadingSkeleton />;
  }

  if (status === "success" && !posts.length && !hasNextPage) {
    return (
      <p className="text-center text-muted-foreground">
        This user hasn&apos;t posted anything yet.
      </p>
    );
  }

  if (status === "error") {
    return (
      <p className="text-center text-destructive">
        An error occurred while loading posts.
      </p>
    );
  }

  return (
    <InfiniteScrollContainer
      className="space-y-5"
      onBottomReached={() => hasNextPage && !isFetching && fetchNextPage()}
    >
      {posts.map(post => (
        <PostItem key={post.id} post={post} />
      ))}
      {isFetchingNextPage && <Loader2 className="mx-auto my-3 animate-spin" />}
    </InfiniteScrollContainer>
  );
}
