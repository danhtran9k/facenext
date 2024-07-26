import { z } from "zod";

import { requiredString } from "@core/types/common.schema";

export const signInSchema = z.object({
  username: requiredString,
  password: requiredString,
});

export type SignInValues = z.infer<typeof signInSchema>;
