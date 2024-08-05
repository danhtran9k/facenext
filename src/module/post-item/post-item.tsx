import Link from "next/link";

import { formatRelativeDate } from "@core/helper/time.utils";
import { PostWithUser } from "@core/prisma/post.prisma";

import { UserAvatar } from "@module/app-global/navbar";
import PostMoreButton from "@module/post-more";

interface PostProps {
  post: PostWithUser;
}

export function PostItem({ post }: PostProps) {
  return (
    <article className="group/post space-y-3 rounded-2xl bg-card p-5 shadow-sm">
      <div className="flex justify-between gap-3">
        <div className="flex flex-wrap gap-3">
          <Link href={`/users/${post.user.username}`}>
            <UserAvatar avatarUrl={post.user.avatarUrl} />
          </Link>
          <div>
            <Link
              href={`/users/${post.user.username}`}
              className="block font-medium hover:underline"
            >
              {post.user.displayName}
            </Link>
            <Link
              href={`/posts/${post.id}`}
              className="block text-sm text-muted-foreground hover:underline"
            >
              {formatRelativeDate(post.createdAt)}
            </Link>
          </div>
        </div>

        {/* TODO: Bug khi đang click thì dropdown menu bị ẩn đi  */}
        <PostMoreButton
          post={post}
          className="opacity-0 transition-opacity group-hover/post:opacity-100"
        />
      </div>
      {/* https://developer.mozilla.org/en-US/docs/Web/CSS/white-space */}
      <div className="whitespace-pre-line break-words">{post.content}</div>
    </article>
  );
}
