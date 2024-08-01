"use client";

import Placeholder from "@tiptap/extension-placeholder";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";

import { useSession } from "@module/app-provider";
import { Button } from "@module/app-shadcn/button";

import { UserAvatar } from "@module/app-global/navbar";

import { submitPost } from "./create-post.action";
import "./styles.css";

export function CreatePostEditor() {
  // https://tiptap.dev/docs/editor/getting-started/install/nextjs#integrate-tiptap
  const { user } = useSession();

  const editor = useEditor({
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

  // https://tiptap.dev/docs/editor/api/editor#methods
  const input =
    editor?.getText({
      blockSeparator: "\n",
    }) ?? "";

  // https://tiptap.dev/docs/editor/api/commands
  async function onSubmit() {
    await submitPost(input);
    editor?.commands.clearContent();
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
        <Button
          onClick={onSubmit}
          disabled={!input.trim()}
          className="min-w-20"
        >
          Post
        </Button>
      </div>
    </div>
  );
}
