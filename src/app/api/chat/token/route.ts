import { INTERNAL_ERROR, UNAUTHORIZED_ERROR } from "@app/api/_core/api.common";
import { validateRequest } from "@app/api/_core/lucia-auth";

import { createTokenGetStream } from "./create-token-getStream";

export async function GET() {
  try {
    const { user } = await validateRequest();

    console.log("Calling get-token for user: ", user?.id);

    if (!user) {
      return UNAUTHORIZED_ERROR;
    }

    const token = createTokenGetStream(user);

    return Response.json({ token });
  } catch (error) {
    console.error(error);
    return INTERNAL_ERROR;
  }
}
