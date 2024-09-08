import { useMutation } from "@tanstack/react-query";
import { useChatContext } from "stream-chat-react";

import { useSession } from "@core/app-provider";
import { toast } from "@core/app-shadcn/use-toast";

import { StreamChatUser } from "@app/api/chat/getStream.type";

const useMutateStreamFn = () => {
  const { client } = useChatContext();
  const { user: loggedInUser } = useSession();

  return async (selectedUsers: StreamChatUser[]) => {
    const channel = client.channel("messaging", {
      members: [loggedInUser.id, ...selectedUsers.map(u => u.id)],
      name:
        selectedUsers.length > 1
          ? loggedInUser.displayName +
            ", " +
            selectedUsers.map(u => u.name).join(", ")
          : undefined,
    });
    await channel.create();
    return channel;
  };
};

export const useGetStreamUpdateChannel = () => {
  const mutationFn = useMutateStreamFn();

  const mutate = useMutation({
    mutationFn,
    onError(error) {
      console.error("Error starting chat", error);
      toast({
        variant: "destructive",
        description: "Error starting chat. Please try again.",
      });
    },
  });

  return mutate;
};
