import { Editor, EditorContent } from "@tiptap/react";
import { ClipboardEvent } from "react";

import { cn } from "@core/utils";

import { useDropzoneUpload } from "./use-dropzone-upload";
import "./styles.css";

type TEditorWithDragDropUpload = {
  editor: Editor | null;
  handleUpload: (files: File[]) => void;
};

export function EditorWithDragDropUpload({
  editor,
  handleUpload,
}: TEditorWithDragDropUpload) {
  const { rootPropsWithoutClick, isDragActive, getInputProps } =
    useDropzoneUpload(handleUpload);

  function onPaste(e: ClipboardEvent<HTMLInputElement>) {
    const files = Array.from(e.clipboardData.items)
      .filter(item => item.kind === "file")
      .map(item => item.getAsFile()) as File[];

    handleUpload(files);
  }

  return (
    <div {...rootPropsWithoutClick} className="w-full">
      <input {...getInputProps()} />
      <EditorContent
        editor={editor}
        className={cn(
          "max-h-[20rem] w-full overflow-y-auto rounded-2xl bg-background px-5 py-3",
          isDragActive && "outline-dashed",
        )}
        onPaste={onPaste}
      />
    </div>
  );
}
