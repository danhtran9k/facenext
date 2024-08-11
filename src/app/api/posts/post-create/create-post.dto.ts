import { z } from "zod";

import { MAX_UPLOAD_FILE_COUNT } from "@core/app.const";
import { requiredString } from "@core/types/common.schema";

export const createPostSchema = z.object({
  content: requiredString,
  mediaIds: z
    .array(z.string())
    .max(
      MAX_UPLOAD_FILE_COUNT,
      `Cannot upload more than ${MAX_UPLOAD_FILE_COUNT} files`,
    ),
});

export type TCreatePost = z.infer<typeof createPostSchema>;
