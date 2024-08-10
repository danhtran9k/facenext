import React, { useRef } from "react";
import { Cropper, ReactCropperElement } from "react-cropper";
import "cropperjs/dist/cropper.css";

import { Button } from "@module/app-shadcn/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@module/app-shadcn/dialog";

interface CropImageDialogProps {
  src: string;
  cropAspectRatio?: number;
  onClose: () => void;
  onCropped: (blob: Blob | null) => void;
}

// src ở đây là ảnh đã được resize tạm
// onCropped dùng src tạm sau crop, set vào form data để gửi lên server
export const CropImageDialog = ({
  src,
  cropAspectRatio = 1,
  onClose,
  onCropped,
}: CropImageDialogProps) => {
  const cropperRef = useRef<ReactCropperElement>(null);

  const onCropHandle = () => {
    const cropper = cropperRef.current?.cropper;
    if (!cropper) return;
    cropper.getCroppedCanvas().toBlob(blob => onCropped(blob), "image/webp");
    onClose();
  };

  // https://github.com/fengyuanchen/cropperjs#options
  // hơi khác example là crop sẽ đẩy sang 1 btn riêng để trigger, ko trigger liên tục
  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Crop image</DialogTitle>
          <DialogDescription />
        </DialogHeader>
        <Cropper
          src={src}
          aspectRatio={cropAspectRatio}
          guides={false}
          zoomable={false}
          ref={cropperRef}
          className="mx-auto size-fit"
        />
        <DialogFooter>
          <Button variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={onCropHandle}>Crop</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
