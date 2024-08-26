import { INTERNAL_ERROR, UNAUTHORIZED_ERROR } from "@app/api/_core/api.common";
import { streamServerClient } from "@app/api/_core/getStream-instance";
import { validateRequest } from "@app/api/_core/lucia-auth";
import { UnreadChatCount } from "@app/api/chat-token/getStream.type";

export async function GET() {
  try {
    const { user } = await validateRequest();

    if (!user) {
      return UNAUTHORIZED_ERROR;
    }

    const { total_unread_count: unreadCount } =
      await streamServerClient.getUnreadCount(user.id);

    const data: UnreadChatCount = {
      unreadCount,
    };

    return Response.json(data);
  } catch (error) {
    console.error(error);
    return INTERNAL_ERROR;
  }
}
