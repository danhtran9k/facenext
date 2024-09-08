import { generateReactHelpers } from "@uploadthing/react";

import { OurFileRouter } from "@app/api/uploadthing/core";

// https://docs.uploadthing.com/api-reference/react#generatereacthelpers

export const { useUploadThing, uploadFiles } =
  generateReactHelpers<OurFileRouter>();
