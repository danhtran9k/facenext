import Placeholder from "@tiptap/extension-placeholder";
import { useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";

export function usePostEditor() {
  // https://tiptap.dev/docs/editor/getting-started/install/nextjs#integrate-tiptap
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

  // https://tiptap.dev/docs/editor/api/editor#methods
  const input =
    editor?.getText({
      blockSeparator: "\n",
    }) ?? "";

  return { editor, input };
}
