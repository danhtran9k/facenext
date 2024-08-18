import { CommentData } from "@app/api/posts/[postId]/comment/comment.dto";

import { formatRelativeDate } from "@core/helper/time.utils";

import { UserAvatar } from "@module/app-global/navbar";
import { TooltipUser } from "@module/tooltip-user";

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
          <span className="text-muted-foreground">
            {formatRelativeDate(comment.createdAt)}
          </span>
        </div>
        <div>{comment.content}</div>
      </div>
    </div>
  );
}
