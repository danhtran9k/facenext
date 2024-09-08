"use client";

import { Loader2 } from "lucide-react";

import { usePostSearchInfinite } from "@app/api/search/use-post-search.hook";

import InfiniteScrollContainer from "@module/app-vendor/InfiniteScrollContainer";

import { PostItem, PostsLoadingSkeleton } from "@module/post-item";

interface PostSearchInfiniteScrollProps {
  query: string;
}

export default function PostSearchInfiniteScroll({
  query,
}: PostSearchInfiniteScrollProps) {
  const {
    data: posts,
    fetchNextPage,
    hasNextPage,
    isFetching,
    isFetchingNextPage,
    status,
  } = usePostSearchInfinite(query, data => {
    return data.pages.flatMap(page => page.posts) || [];
  });

  if (status === "pending") {
    return <PostsLoadingSkeleton />;
  }

  if (status === "success" && !posts.length && !hasNextPage) {
    return (
      <p className="text-center text-muted-foreground">
        No posts found for this query.
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
