import { Check, Loader2 } from "lucide-react";

import { StreamChatUser } from "@app/api/chat-token/getStream.type";
import { useGetStreamUsers } from "@app/api/chat-token/use-get-stream-users.hook";

import { UserAvatar } from "@module/app-global/navbar";

type TUserQueryList = {
  debounceInput: string;
  selectedUsers: StreamChatUser[];
  getHandleUserSelect: (user: StreamChatUser) => () => void;
};

export const UsersQueryList = ({
  debounceInput,
  selectedUsers,
  getHandleUserSelect,
}: TUserQueryList) => {
  const { data, isFetching, isError, isSuccess } =
    useGetStreamUsers(debounceInput);

  return (
    <>
      {isFetching && <Loader2 className="mx-auto my-3 animate-spin" />}
      {isError && (
        <p className="my-3 text-center text-destructive">
          An error occurred while loading users.
        </p>
      )}

      {isSuccess && !data.users.length && (
        <p className="my-3 text-center text-muted-foreground">
          No users found. Try a different name.
        </p>
      )}

      {isSuccess &&
        data.users.map(user => {
          const isSelected = selectedUsers.some(u => u.id === user.id);
          const handleUserSelect = getHandleUserSelect(user);

          return (
            <button
              key={user.id}
              className="flex w-full items-center justify-between px-4 py-2.5 transition-colors hover:bg-muted/50"
              onClick={handleUserSelect}
            >
              <div className="flex items-center gap-2">
                <UserAvatar avatarUrl={user.image} />

                <div className="flex flex-col text-start">
                  <p className="font-bold">{user.name}</p>
                  <p className="text-muted-foreground">@{user.username}</p>
                </div>
              </div>

              {isSelected && <Check className="size-5 text-green-500" />}
            </button>
          );
        })}
    </>
  );
};
