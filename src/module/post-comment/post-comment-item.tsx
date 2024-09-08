import { formatRelativeDate } from "@core/helper/time.utils";

import { CommentData } from "@app/api/posts/[postId]/comment/comment.dto";

import { TooltipUser } from "@module/app-common/tooltip-user";
import { UserAvatar } from "@module/app-global/navbar";

import { CommentMoreButton } from "@module/post-comment";

interface CommentProps {
  comment: CommentData;
}

export function PostCommentItem({ comment }: CommentProps) {
  return (
    <div className="group/comment flex gap-3 py-3">
      <span className="hidden sm:inline">
        <TooltipUser user={comment.user}>
          <UserAvatar avatarUrl={comment.user.avatarUrl} size={40} />
        </TooltipUser>
      </span>
      <div>
        <div className="flex items-center gap-1 text-sm">
          <TooltipUser
            user={comment.user}
            className="font-medium hover:underline"
          >
            {comment.user.displayName}
          </TooltipUser>
          <span className="text-muted-foreground" suppressHydrationWarning>
            {formatRelativeDate(comment.createdAt)}
          </span>
        </div>
        <div>{comment.content}</div>
      </div>
      <CommentMoreButton
        comment={comment}
        className="ms-auto opacity-0 transition-opacity group-hover/comment:opacity-100"
        // logic check logic comment thuộc user hay ko nhét vào trong component
        // trade-off, ko clear ở ui ngoài nhưng bù lại giới hạn tầm 'use client'
      />
    </div>
  );
}
