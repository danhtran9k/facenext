import { useDeletePostMutation } from "@app/api/posts/post-delete/delete-post.mutate";
import { PostWithUser } from "@app/api/posts/post.prisma";

import { Button } from "@module/app-shadcn/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@module/app-shadcn/dialog";

import LoadingButton from "@module/app-common/loading-btn";

interface DeletePostDialogProps {
  post: PostWithUser;
  open: boolean;
  onClose: () => void;
}

export function DeletePostDialog({
  post,
  open,
  onClose,
}: DeletePostDialogProps) {
  const { mutate, isPending } = useDeletePostMutation();

  // State hơi dị, open nhưng cần setOpen thêm ???
  // click OutSide chỉ gọi handleOpenChange mà ko thật sự thay đổi state
  // phải manual set, đang mutate ko cho close dialog
  function handleOpenChange(open: boolean) {
    if (!open || !isPending) {
      onClose();
    }
  }

  // Vì state close là async nên ko dùng asChild Trigger như trong ex của shadcn được, ko cần dùng trigger luôn
  // https://www.radix-ui.com/primitives/docs/components/dialog#close-after-asynchronous-form-submission
  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete post?</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete this post? This action cannot be
            undone.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <LoadingButton
            variant="destructive"
            onClick={() => mutate(post.id, { onSuccess: onClose })}
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
