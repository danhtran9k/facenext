"use client";

import { Loader2 } from "lucide-react";

import InfiniteScrollContainer from "@module/app-common/InfiniteScrollContainer";

import { PostItem, PostsLoadingSkeleton } from "@module/post-item";

import { useInfinityFeed } from "./useInfinityFeed";

const _nativeFetch_ForYouFeed = async () => {
  const res = await fetch("/api/posts/for-you");
  if (!res.ok) {
    throw Error(`Request failed with status code ${res.status}`);
  }

  // Đối với các data primitive đơn giản thì .json() ok
  // tuy nhiên chú ý post có data dạng Date()
  // .json() bình thường logic xử lý tiếp vào date sẽ sai
  return res.json();
};

export function ForYouFeedClient() {
  const {
    data: posts,
    fetchNextPage,
    hasNextPage,
    isFetching,
    isFetchingNextPage,
    status,
  } = useInfinityFeed(data => {
    // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/flatMap
    return data.pages.flatMap(page => page.posts) || [];
  });

  if (status === "pending") {
    return <PostsLoadingSkeleton />;
  }

  if (status === "error") {
    return (
      <p className="text-center text-destructive">
        An error occurred while loading posts.
      </p>
    );
  }

  if (status === "success" && !posts.length && !hasNextPage) {
    return (
      <p className="text-center text-muted-foreground">
        No one has posted anything yet.
      </p>
    );
  }

  const handleLoadMore = () => {
    if (hasNextPage && !isFetching && !isFetchingNextPage) {
      fetchNextPage();
    }
  };

  return (
    <InfiniteScrollContainer
      className="space-y-5"
      onBottomReached={handleLoadMore}
    >
      {posts.map(post => (
        <PostItem key={post.id} post={post} />
      ))}
      {isFetchingNextPage && <Loader2 className="mx-auto my-3 animate-spin" />}
    </InfiniteScrollContainer>
  );
}
