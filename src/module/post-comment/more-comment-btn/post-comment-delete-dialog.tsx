"use client";

import { CommentData } from "@app/api/posts/[postId]/comment/comment.dto";
import { useDeleteComment } from "@app/api/posts/[postId]/comment/use-delete-comment.hook";

import { Button } from "@core/app-shadcn/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@core/app-shadcn/dialog";

import LoadingButton from "@module/app-common/loading-btn";

interface DeleteCommentDialogProps {
  comment: CommentData;
  open: boolean;
  onClose: () => void;
}

export function DeleteCommentDialog({
  comment,
  open,
  onClose,
}: DeleteCommentDialogProps) {
  const { isPending, mutate } = useDeleteComment();

  function handleOpenChange(open: boolean) {
    if (!open || !isPending) {
      onClose();
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete comment?</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete this comment? This action cannot be
            undone.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <LoadingButton
            variant="destructive"
            onClick={() => mutate(comment.id, { onSuccess: onClose })}
            loading={isPending}
          >
            Delete
          </LoadingButton>
          <Button variant="outline" onClick={onClose} disabled={isPending}>
            Cancel
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
