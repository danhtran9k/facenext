"use client";

import { Loader2 } from "lucide-react";

import { useBookmarkInfinity } from "@app/api/posts/bookmarked/use-bookmark-infinity";

import InfiniteScrollContainer from "@module/app-common/InfiniteScrollContainer";

import { PostItem, PostsLoadingSkeleton } from "@module/post-item";

export function BookmarksListInf() {
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetching,
    isFetchingNextPage,
    status,
  } = useBookmarkInfinity();

  const posts = data?.pages.flatMap(page => page.posts) || [];

  if (status === "pending") {
    return <PostsLoadingSkeleton />;
  }

  if (status === "success" && !posts.length && !hasNextPage) {
    return (
      <p className="text-center text-muted-foreground">
        You don&apos;t have any bookmarks yet.
      </p>
    );
  }

  if (status === "error") {
    return (
      <p className="text-center text-destructive">
        An error occurred while loading bookmarks.
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
