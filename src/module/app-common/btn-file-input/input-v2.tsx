import { ChangeEvent, cloneElement, ReactElement, useRef } from "react";

import { TFileInput } from "@module/app-common/btn-file-input/file-input.type";

export function BtnFileInput({
  onFileSelected,
  accept,
  isMultiple = false,
  children,
  className,
  // onSelected,
  btnCustom,
  ...props
}: TFileInput) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const onButtonClick = () => fileInputRef.current?.click();

  const onFilesChange = (e: ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);

    if (files.length) {
      if (isMultiple === true) {
        console.log(isMultiple);
        onFileSelected(files);
      } else {
        onFileSelected(files[0]);
      }
      e.target.value = "";
    }
  };

  return (
    <>
      {btnCustom ? ( // Clone the custom button and pass the onClick event handler to it
        cloneElement(btnCustom as ReactElement, { onClick: onButtonClick })
      ) : (
        <button
          {...props}
          type="button"
          onClick={onButtonClick}
          className={className}
        >
          {children}
        </button>
      )}

      <input
        type="file"
        accept={accept}
        multiple={isMultiple}
        ref={fileInputRef}
        className="sr-only hidden"
        onChange={onFilesChange}
      />
    </>
  );
}