"use client";

import { useQuery } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";

import kyInstance from "@core/ky";
import { PostWithUser } from "@core/prisma/post.prisma";

import { PostItem } from "@module/post-item";

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
  const query = useQuery<PostWithUser[]>({
    queryKey: ["post-feed", "for-you"],
    queryFn: kyInstance.get("/api/posts/for-you").json<PostWithUser[]>,
  });

  if (query.status === "pending") {
    return <Loader2 className="mx-auto animate-spin" />;
  }

  if (query.status === "error") {
    return (
      <p className="text-center text-destructive">
        An error occurred while loading posts.
      </p>
    );
  }

  return (
    <>
      {query.data.map(post => (
        <PostItem key={post.id} post={post} />
      ))}
    </>
  );
}
