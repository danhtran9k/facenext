"use client";

import { EditorContent } from "@tiptap/react";
import { ImageIcon, Loader2 } from "lucide-react";

import { useSubmitPostMutation } from "@app/api/posts/post-create/createPost.mutate";
import { usePostMediaUpload } from "@app/api/posts/post-media/use-post-media-upload";

import { useSession } from "@module/app-provider";
import { Button } from "@module/app-shadcn/button";

import { BtnFileInput } from "@module/app-common/btn-file-input";
import LoadingButton from "@module/app-common/loading-btn";

import { UserAvatar } from "@module/app-global/navbar";

import { AttachmentPreviews } from "./post-attach-preview";
import "./styles.css";
import { usePostEditor } from "./use-post-editor";

export function CreatePostEditor() {
  const { user } = useSession();
  const { input, editor } = usePostEditor();
  const { mutate, isPending } = useSubmitPostMutation();

  const {
    startUpload,
    attachments,
    isUploading,
    uploadProgress,
    removeAttachment,
    reset: resetMediaUploads,
  } = usePostMediaUpload();

  async function onSubmit() {
    // Chỉ get những idUpload đã được be trả về id để gửi
    // Thực chất cũng có thể filter theo isUploading false nhưng rồi cũng map lấy mediaId lại để gửi
    // Dù tên file có thể unique (do setup dc backend) nhưng ko nên sử dụng giao tiếp với be
    const mediaIds = attachments
      .map(a => a.mediaId)
      .filter(Boolean) as string[];

    // await submitPost(input);
    // có thể dùng try-catch xử lý trực tiếp nhưng lằng nhằng state
    mutate(
      { content: input, mediaIds },
      {
        // đúng ra viết arrow func nhưng chơi style lạ
        onSuccess() {
          // https://tiptap.dev/docs/editor/api/commands
          editor?.commands.clearContent();
          resetMediaUploads();
        },
      },
    );
  }

  return (
    <div className="flex flex-col gap-5 rounded-2xl bg-card p-5 shadow-sm">
      <div className="flex gap-5">
        <UserAvatar avatarUrl={user.avatarUrl} className="hidden sm:inline" />
        <EditorContent
          editor={editor}
          className="max-h-[20rem] w-full overflow-y-auto rounded-2xl bg-background px-5 py-3"
        />
      </div>

      {!!attachments.length && (
        <AttachmentPreviews
          attachments={attachments}
          removeAttachment={removeAttachment}
        />
      )}

      <div className="flex items-center justify-end gap-3">
        {isUploading && (
          <>
            <span className="text-sm">{uploadProgress ?? 0}%</span>
            <Loader2 className="size-5 animate-spin text-primary" />
          </>
        )}
        <BtnFileInput
          isMultiple
          accept="image/*, video/*"
          onSelectedMulti={startUpload}
          disabled={isUploading || attachments.length >= 5}
          btnCustom={
            <Button
              variant="ghost"
              size="icon"
              className="text-primary hover:text-primary"
            >
              <ImageIcon size={20} />
            </Button>
          }
        />

        <LoadingButton
          onClick={onSubmit}
          disabled={!input.trim() || isUploading}
          loading={isPending}
          className="min-w-20"
        >
          Post
        </LoadingButton>
      </div>
    </div>
  );
}
