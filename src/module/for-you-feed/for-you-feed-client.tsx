"use client";

import { useQuery } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";

import { PostWithUser } from "@core/prisma/post.prisma";

import { PostItem } from "@module/post-item";

export function ForYouFeedClient() {
  const query = useQuery<PostWithUser[]>({
    queryKey: ["post-feed", "for-you"],
    queryFn: async () => {
      const res = await fetch("/api/posts/for-you");
      if (!res.ok) {
        throw Error(`Request failed with status code ${res.status}`);
      }

      // Đối với các data primitive đơn giản thì .json() ok
      // tuy nhiên chú ý post có data dạng Date()
      // .json() bình thường logic xử lý tiếp vào date sẽ sai
      return res.json();
    },
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
