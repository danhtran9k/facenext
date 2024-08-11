"use-client";

import { Camera } from "lucide-react";
import Image, { StaticImageData } from "next/image";
import { useRef } from "react";

import { ACCEPTED_UPLOAD_FILE_TYPES } from "@core/app.const";

import { BtnFileInput } from "@module/app-common/btn-file-input";

import { CropImageDialog, useCropImageResize } from "@module/app-vendor";

interface AvatarInputProps {
  src: string | StaticImageData;
  setSrc: (blob: Blob | null) => void;
}

export function UserProfileAvatarUpload({ src, setSrc }: AvatarInputProps) {
  // cả 2 set này đều modify state của imageToCrop
  const { imageToCrop, setImageToCrop, setResizeImage } = useCropImageResize();
  const fileInputRef = useRef<HTMLInputElement>(null);

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

  // Ảnh được chọn sẽ resize ngay trước khi xử lý cropped
  // setResizeImage -> imageToCrop has value -> CropImageDialog show
  return (
    <>
      <BtnFileInput
        accept={ACCEPTED_UPLOAD_FILE_TYPES.AVATAR}
        onSelectedSingle={setResizeImage}
        className="group relative block"
      >
        <>
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
        </>
      </BtnFileInput>
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
