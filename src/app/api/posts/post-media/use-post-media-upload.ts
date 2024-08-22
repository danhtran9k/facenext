import { useState } from "react";

import { useToast } from "@core/app-shadcn/use-toast";
import { useUploadThing } from "@core/app-vendor/uploadthing.ts";
import { splitFilename } from "@core/helper/filename.utils";

export interface Attachment {
  file: File;
  mediaId?: string;
  isUploading: boolean;
}

export function usePostMediaUpload() {
  const { toast } = useToast();

  // attachments là client state hoàn toàn,
  // khi đang uploading logic ui sẽ chặn ko cho gọi set
  const [attachments, setAttachments] = useState<Attachment[]>([]);
  const [uploadProgress, setUploadProgress] = useState<number>();

  // ở đây setup đơn giản chỉ remove ở client, do media upload này cũng lưu tạm
  // nếu post ko được tạo thì be sẽ cronjob schedule clean up
  // cố gắng xử lý gọi api clear cũng ok nhưng dễ gây lỗi - edge case ko cần thiết
  function removeAttachment(fileName: string) {
    setAttachments(prev => prev.filter(a => a.file.name !== fileName));
  }

  function reset() {
    setAttachments([]);
    setUploadProgress(undefined);
  }

  // https://docs.uploadthing.com/api-reference/react#configuration-3
  const { startUpload, isUploading } = useUploadThing("attachment", {
    onBeforeUploadBegin(files) {
      // mẹo rename file để khi BE trả về có thể match với state client
      // Tuy nhiên cách làm này modified file name gốc khi upload
      // Trade-off
      const renamedFiles = files.map(file => {
        const { name, extensionWithDot } = splitFilename(file.name);
        const newFileName = `${name}_${crypto.randomUUID()}${extensionWithDot}`;

        return new File([file], newFileName, {
          type: file.type,
        });
      });

      // có thể chọn xong lại chọn tiếp
      setAttachments(prev => [
        ...prev,
        ...renamedFiles.map(file => ({ file, isUploading: true })),
      ]);

      return renamedFiles;
    },
    onUploadProgress: setUploadProgress,
    // vì đang dùng setup của Next - fullstack nên res nên được type từ helper
    onClientUploadComplete(res) {
      // set state isUploading = false đối với các file client match res
      // vì đã trick filename ở trên nên có thể đảm bảo unique
      // kiểu ăn gian filename thành 1 id trung gian giữa client và server
      // -> mà ko cần dùng mediaId từ db
      setAttachments(prevAttachments =>
        prevAttachments.map(prev => {
          const uploadResult = res.find(r => r.name === prev.file.name);

          return uploadResult
            ? {
                ...prev,
                mediaId: uploadResult.serverData.mediaId,
                isUploading: false,
              }
            : prev;
        }),
      );
    },
    onUploadError(err) {
      console.log("🚀 ~ onUploadError ~ err:", err);
      // Xử lý hơi cực đoan, cancel toàn bộ isUploading
      // có thể xử lý riêng từng file nhưng phải dùng 1 state enum, boolean ko đủ, và logic sẽ càng phức tạp thêm feature này
      setAttachments(prev => prev.filter(a => !a.isUploading));
      toast({
        variant: "destructive",
        description: err.message,
      });
    },
  });

  function handleStartUpload(files: File[]) {
    // chỉ cho phép gọi upload khi ko có file nào đang upload
    // vì limit của thư viện, ko track status riêng từng file được
    // đồng thời progress nếu nhiều cụm file đi đồng thời nhưng lệch nhau gây vấn đề
    // TRADE-OFF
    if (isUploading) {
      toast({
        variant: "destructive",
        description: "Please wait for the current upload to finish.",
      });
      return;
    }

    // Chỉ phòng thủ FE, nếu dùng api trực tiếp thì BE phải limit riêng
    // Bản chất BE đang limit riêng 5 mỗi loại
    if (attachments.length + files.length > 5) {
      toast({
        variant: "destructive",
        description: "You can only upload up to 5 attachments per post.",
      });
      return;
    }

    startUpload(files);
  }

  return {
    attachments,
    isUploading,
    uploadProgress,
    startUpload: handleStartUpload,
    removeAttachment,
    reset,
  };
}
