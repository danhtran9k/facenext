import { z } from "zod";

import { requiredString } from "@core/types/common.schema";

export const createPostSchema = z.object({
  content: requiredString,
});
