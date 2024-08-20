"use client";

import { MoreHorizontal, Trash2 } from "lucide-react";
import { useState } from "react";

import { CommentData } from "@app/api/posts/[postId]/comment/comment.dto";

import { useSession } from "@core/app-provider";
import { Button } from "@core/app-shadcn/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@core/app-shadcn/dropdown-menu";

import { DeleteCommentDialog } from "./post-comment-delete-dialog";

interface CommentMoreButtonProps {
  comment: CommentData;
  className?: string;
}

export function CommentMoreButton({
  comment,
  className,
}: CommentMoreButtonProps) {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const { user } = useSession();

  if (comment.userId !== user?.id) return null;

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button size="icon" variant="ghost" className={className}>
            <MoreHorizontal className="size-5 text-muted-foreground" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem onClick={() => setShowDeleteDialog(true)}>
            <span className="flex items-center gap-3 text-destructive">
              <Trash2 className="size-4" />
              Delete
            </span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <DeleteCommentDialog
        comment={comment}
        open={showDeleteDialog}
        onClose={() => setShowDeleteDialog(false)}
      />
    </>
  );
}
