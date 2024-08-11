import { X } from "lucide-react";
import Image from "next/image";

import { Attachment } from "@app/api/posts/post-media/use-post-media-upload";

import { cn } from "@core/utils";

interface AttachmentPreviewItemProps {
  attachment: Attachment;
  onRemoveClick: () => void;
}

function AttachmentPreviewItem({
  attachment: { file, mediaId, isUploading },
  onRemoveClick,
}: AttachmentPreviewItemProps) {
  const src = URL.createObjectURL(file);
  const isImage = file.type.startsWith("image");

  // apiUploadthing ko cung cấp cancel request
  // chi delete khi done
  return (
    <div
      className={cn("relative mx-auto size-fit", isUploading && "opacity-50")}
    >
      {isImage ? (
        <Image
          src={src}
          alt="Attachment preview"
          width={500}
          height={500}
          className="size-fit max-h-[30rem] rounded-2xl"
        />
      ) : (
        <video controls className="size-fit max-h-[30rem] rounded-2xl">
          <source src={src} type={file.type} />
          <track kind="captions" />
        </video>
      )}

      {!isUploading && (
        <button
          onClick={onRemoveClick}
          className="absolute right-3 top-3 rounded-full bg-foreground p-1.5 text-background transition-colors hover:bg-foreground/60"
        >
          <X size={20} />
        </button>
      )}
    </div>
  );
}

interface AttachmentPreviewsProps {
  attachments: Attachment[];
  removeAttachment: (fileName: string) => void;
}

export function AttachmentPreviews({
  attachments,
  removeAttachment,
}: AttachmentPreviewsProps) {
  return (
    <div
      className={cn(
        "flex flex-col gap-3",
        attachments.length > 1 && "sm:grid sm:grid-cols-2",
      )}
    >
      {attachments.map(attachment => (
        <AttachmentPreviewItem
          key={attachment.file.name}
          attachment={attachment}
          onRemoveClick={() => removeAttachment(attachment.file.name)}
        />
      ))}
    </div>
  );
}
