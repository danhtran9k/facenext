import { useQuery } from "@tanstack/react-query";
import { useChatContext } from "stream-chat-react";

import { GetStreamUsersQuery } from "@app/api/chat/getStream.type";

import { useSession } from "@core/app-provider";

const queryKey = (input: string) => ["stream-users", input];

const getStreamUsersQuery = (
  userId: string,
  input: string,
): GetStreamUsersQuery => {
  const queryByNameOrUsername = {
    $or: [
      { name: { $autocomplete: input } },
      { username: { $autocomplete: input } },
    ],
  } satisfies GetStreamUsersQuery;

  return {
    id: { $ne: userId },
    role: { $ne: "admin" },
    ...(input ? queryByNameOrUsername : {}),
  };
};

// Có thể truyền userId vào để tránh phụ thuộc
export const useGetStreamUsers = (input: string) => {
  const { client } = useChatContext();
  const { user: loggedInUser } = useSession();

  // queryFn TH này quá phức tạm, ko extract hàm ra
  // Limit thấp vì getStream free cũng chỉ cho max 25 / month
  const query = useQuery({
    queryKey: queryKey(input),
    queryFn: async () =>
      client.queryUsers(
        getStreamUsersQuery(loggedInUser.id, input),
        { name: 1, username: 1 },
        { limit: 4 },
      ),
    // Cho phép query all hay ko
    // enabled: !!input,
  });

  return query;
};
