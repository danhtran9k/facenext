"use client";

import Placeholder from "@tiptap/extension-placeholder";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";

import { useSession } from "@module/app-provider";

import LoadingButton from "@module/app-common/loading-btn";

import { UserAvatar } from "@module/app-global/navbar";

import { submitPost } from "./create-post.action";
import "./styles.css";
import { useSubmitPostMutation } from "./createPost.mutate";

export function CreatePostEditor() {
  // https://tiptap.dev/docs/editor/getting-started/install/nextjs#integrate-tiptap
  const { user } = useSession();

  const editor = useEditor({
    // solving warning
    // https://tiptap.dev/docs/guides/performance#gain-more-control-over-rendering
    // https://tiptap.dev/blog/release-notes/say-hello-to-tiptap-2-5-our-most-performant-editor-yet
    immediatelyRender: false,
    extensions: [
      // https://tiptap.dev/docs/editor/extensions/functionality/starterkit#using-the-starterkit-extension
      StarterKit.configure({
        bold: false,
        italic: false,
      }),
      // https://tiptap.dev/docs/editor/extensions/functionality/placeholder#placeholder
      Placeholder.configure({
        placeholder: "What's crack-a-lackin'?",
      }),
    ],
  });
  const { mutate, isPending } = useSubmitPostMutation();

  // https://tiptap.dev/docs/editor/api/editor#methods
  const input =
    editor?.getText({
      blockSeparator: "\n",
    }) ?? "";

  // https://tiptap.dev/docs/editor/api/commands
  async function onSubmit() {
    // await submitPost(input);
    // có thể dùng try-catch xử lý trực tiếp nhưng lằng nhằng state
    mutate(input, {
      // đúng ra viết arrow func nhưng chơi style lạ
      onSuccess() {
        editor?.commands.clearContent();
      },
    });
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
