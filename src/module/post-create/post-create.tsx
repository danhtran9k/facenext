"use client";

import { EditorContent } from "@tiptap/react";

import { useSubmitPostMutation } from "@app/api/posts/post-create/createPost.mutate";

import { useSession } from "@module/app-provider";

import LoadingButton from "@module/app-common/loading-btn";

import { UserAvatar } from "@module/app-global/navbar";

import "./styles.css";
import { usePostEditor } from "./use-post-editor";

export function CreatePostEditor() {
  const { user } = useSession();
  const { input, editor } = usePostEditor();
  const { mutate, isPending } = useSubmitPostMutation();

  async function onSubmit() {
    const mediaIds: string[] = [];

    // await submitPost(input);
    // có thể dùng try-catch xử lý trực tiếp nhưng lằng nhằng state
    mutate(
      { content: input, mediaIds },
      {
        // đúng ra viết arrow func nhưng chơi style lạ
        onSuccess() {
          // https://tiptap.dev/docs/editor/api/commands
          editor?.commands.clearContent();
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

      <div className="flex justify-end">
        <LoadingButton
          onClick={onSubmit}
          disabled={!input.trim()}
          loading={isPending}
          className="min-w-20"
        >
          Post
        </LoadingButton>
      </div>
    </div>
  );
}
