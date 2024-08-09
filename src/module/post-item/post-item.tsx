import Link from "next/link";

import { PostWithUser } from "@app/api/posts/post.prisma";

import { formatRelativeDate } from "@core/helper/time.utils";

import { UserAvatar } from "@module/app-global/navbar";
import { Linkify } from "@module/linkify";
import PostMoreButton from "@module/post-more";
import { TooltipUser } from "@module/tooltip-user";

interface PostProps {
  post: PostWithUser;
}

export function PostItem({ post }: PostProps) {
  // Bọc Linkify vào post content khá căng, mọi post sẽ tự fetch lại user, hover vào thì sẽ có popup profile, trong popup profile lại có thể hover vào mention trong profile -> ??
  // Hoặc có thể xử lý Linkify này chỉ có 1 tầng popup, không cho popup lồng vào popup -> cần modifiy code Linkify
  return (
    <article className="group/post space-y-3 rounded-2xl bg-card p-5 shadow-sm">
      <div className="flex justify-between gap-3">
        <div className="flex flex-wrap gap-3">
          <TooltipUser user={post.user}>
            <UserAvatar avatarUrl={post.user.avatarUrl} />
          </TooltipUser>

          <div>
            <TooltipUser
              user={post.user}
              className="block font-medium hover:underline"
            >
              {post.user.displayName}
            </TooltipUser>

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
      <div className="whitespace-pre-line break-words">
        <Linkify>{post.content}</Linkify>
      </div>
    </article>
  );
}
