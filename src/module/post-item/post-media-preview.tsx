import { Media, MediaType } from "@prisma/client";
import Image from "next/image";

import { cn } from "@core/utils";

interface MediaPreviewsProps {
  attachments: Media[];
}

export function MediaPreviews({ attachments }: MediaPreviewsProps) {
  return (
    <div
      className={cn(
        "flex flex-col gap-3",
        attachments.length > 1 && "sm:grid sm:grid-cols-2",
      )}
    >
      {attachments.map(m => (
        <MediaPreviewItem key={m.id} media={m} />
      ))}
    </div>
  );
}

interface MediaPreviewItemProps {
  media: Media;
}

function MediaPreviewItem({ media }: MediaPreviewItemProps) {
  // TODO thử ko map trong ENUM xem, prisma dùng number hay string
  if (media.type === MediaType.IMAGE) {
    return (
      <Image
        src={media.url}
        alt="Attachment"
        width={500}
        height={500}
        className="mx-auto size-fit max-h-[30rem] rounded-2xl"
      />
    );
  }

  if (media.type === MediaType.VIDEO) {
    return (
      <div>
        <video
          src={media.url}
          controls
          className="mx-auto size-fit max-h-[30rem] rounded-2xl"
        >
          <track kind="captions" />
        </video>
      </div>
    );
  }

  return <p className="text-destructive">Unsupported media type</p>;
}
