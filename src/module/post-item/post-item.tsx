"use client";

import Link from "next/link";
import { useState } from "react";

import { formatRelativeDate } from "@core/helper/time.utils";
import { PATH_URL } from "@core/path.const";

import { PostWithUser } from "@app/api/posts/post.prisma";

import { TooltipUser } from "@module/app-common/tooltip-user";
import { UserAvatar } from "@module/app-global/navbar";
import { Linkify } from "@module/app-vendor/linkify";

import { BookmarkButton } from "@module/bookmark-btn";
import { LikeButton } from "@module/like-btn";
import { PostCommentShowBtn, PostComment } from "@module/post-comment";
import PostMoreButton from "@module/post-more";

import { MediaPreviews } from "./post-media-preview";

interface PostProps {
  post: PostWithUser;
}

export function PostItem({ post }: PostProps) {
  // Bọc Linkify vào post content khá căng, mọi post sẽ tự fetch lại user, hover vào thì sẽ có popup profile, trong popup profile lại có thể hover vào mention trong profile -> ??
  // Hoặc có thể xử lý Linkify này chỉ có 1 tầng popup, không cho popup lồng vào popup -> cần modifiy code Linkify
  const [showComments, setShowComments] = useState(false);

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
              href={PATH_URL.postItem(post.id)}
              className="block text-sm text-muted-foreground hover:underline"
              // do hàm tính toán Data sẽ khiến createdAt cache
              // Tạm sẽ test ko dùng xem có lỗi ko
              suppressHydrationWarning
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

      {!!post.attachments.length && (
        <MediaPreviews attachments={post.attachments} />
      )}

      <hr className="text-muted-foreground" />
      <div className="gap- flex justify-between">
        <div className="flex items-center gap-5">
          <LikeButton
            postId={post.id}
            initialState={{
              likes: post._count.likes,
              // isLikedByUser: post.likes.some(like => like.userId === user.id),
              // Logic bên trên chuẩn hơn nhưng sẽ phải chuyển thành use-client để lấy user, hoặc truyền post.likes vào LikeButton

              // WARNING-DANGER-TODO: Bản chất ở dây cheat vì be chỉ trả về like chứa chính user đang query
              // Nếu be có trả list user like thì initial data cũng thay đổi
              // isLike có thể tính toán ngay trong component
              isLikedByUser: !!post.likes?.length,
            }}
          />
          <PostCommentShowBtn
            post={post}
            onClick={() => setShowComments(!showComments)}
          />
        </div>
        <BookmarkButton
          postId={post.id}
          // tương tự như LikeButton, be chỉ trả về bookmark của user đang query
          initialState={{
            isBookmarkedByUser: !!post.bookmarks.length,
          }}
        />
      </div>
      {showComments && <PostComment post={post} />}
    </article>
  );
}
