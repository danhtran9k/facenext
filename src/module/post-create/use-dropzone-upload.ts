import { useDropzone } from "@uploadthing/react";

type THandleUpload = (files: File[]) => void;

export function useDropzoneUpload(handleUpload: THandleUpload) {
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: handleUpload,
  });

  // default behavior rootProps sẽ cho click vào để chọn file
  // exclude ra, và chú ý onClick này ở rootProps, ko phải getInputProps
  const { onClick: _, ...rootProps } = getRootProps();

  return {
    rootPropsWithoutClick: rootProps,
    getRootProps,
    getInputProps,
    isDragActive,
  };
}
