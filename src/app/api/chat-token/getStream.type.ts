import { UserFilters, UserResponse } from "stream-chat";
import { DefaultStreamChatGenerics } from "stream-chat-react";

export type GetStreamUsersQuery = UserFilters<DefaultStreamChatGenerics>;
export type StreamChatUser = UserResponse<DefaultStreamChatGenerics>;
