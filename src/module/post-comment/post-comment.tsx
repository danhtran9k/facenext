import { PostWithUser } from "@app/api/posts/post.prisma";

import { PostCommentInfinity } from "./post-comment-infinity";
import { PostCommentInput } from "./post-comment-input";

interface CommentsProps {
  post: PostWithUser;
}

export function PostComment({ post }: CommentsProps) {
  return (
    <div className="space-y-3">
      <PostCommentInput post={post} />
      <PostCommentInfinity post={post} />
    </div>
  );
}
