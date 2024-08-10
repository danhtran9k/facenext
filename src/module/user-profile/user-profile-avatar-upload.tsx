"use-client";

import { Camera } from "lucide-react";
import Image, { StaticImageData } from "next/image";
import { ChangeEvent, useRef } from "react";

import { CropImageDialog, useCropImageResize } from "@module/app-vendor";

interface AvatarInputProps {
  src: string | StaticImageData;
  setSrc: (blob: Blob | null) => void;
}

export function UserProfileAvatarUpload({ src, setSrc }: AvatarInputProps) {
  // cả 2 set này đều modify state của imageToCrop
  const { imageToCrop, setImageToCrop, setResizeImage } = useCropImageResize();
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Ảnh được chọn sẽ resize ngay trước khi xử lý cropped
  // resize image này set vào chính state của imageToCrop
  function onImageSelected(e: ChangeEvent<HTMLInputElement>) {
    const image = e.target.files?.[0];
    setResizeImage(image);
  }

  function onCloseCropDialog() {
    setImageToCrop(undefined);
    // reset file input để có thể chọn lạ file cũ khi cần
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  }

  // hidden input, proxy button simulate input click by ref
  // URL.createObjectURL -> create url from Blob
  // CSS_NOTE: https://developer.mozilla.org/en-US/docs/Web/CSS/inset
  // -> span ôm trọn div, sau đó flex + center để icon nằm giữa
  return (
    <>
      <input
        type="file"
        accept="image/*"
        onChange={onImageSelected}
        ref={fileInputRef}
        className="sr-only hidden"
      />
      <button
        type="button"
        onClick={() => fileInputRef.current?.click()}
        className="group relative block"
      >
        <Image
          src={src}
          alt="Avatar preview"
          width={150}
          height={150}
          className="size-32 flex-none rounded-full object-cover"
        />
        <span className="absolute inset-0 m-auto flex size-12 items-center justify-center rounded-full bg-black bg-opacity-30 text-white transition-colors duration-200 group-hover:bg-opacity-25">
          <Camera size={24} />
        </span>
      </button>

      {imageToCrop && (
        <CropImageDialog
          src={URL.createObjectURL(imageToCrop)}
          onCropped={setSrc}
          onClose={onCloseCropDialog}
        />
      )}
    </>
  );
}
