// Phòng ngừa case đặc biệt ko có ext
// xử lý hơi dặc biệt vì fileName modified này là tempId trao đổi giữa client và server trước khi có id lưu vào db
export function splitFilename(filename: string) {
  const lastDotIndex = filename.lastIndexOf(".");

  if (lastDotIndex === -1) {
    return {
      name: filename,
      extension: "",
      extensionWithDot: "",
    };
  }

  const extension = filename.substring(lastDotIndex + 1);

  return {
    name: filename.substring(0, lastDotIndex),
    extension,
    extensionWithDot: `.${extension}`,
  };
}
