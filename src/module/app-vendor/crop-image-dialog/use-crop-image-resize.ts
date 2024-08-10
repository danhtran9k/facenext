import { useState } from "react";
import Resizer from "react-image-file-resizer";

export const useCropImageResize = () => {
  const [imageToCrop, setImageToCrop] = useState<File>();

  const setResizeImage = (image: File | undefined) => {
    if (!image) return;

    Resizer.imageFileResizer(
      image,
      1024,
      1024,
      "WEBP",
      100,
      0,
      uri => setImageToCrop(uri as File),
      "file",
    );
  };

  return {
    imageToCrop,
    setImageToCrop,
    setResizeImage,
  };
};
