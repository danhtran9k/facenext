import { useMutation } from "@tanstack/react-query";
import { useChatContext } from "stream-chat-react";

import { StreamChatUser } from "@app/api/chat-token/getStream.type";

import { useSession } from "@core/app-provider";
import { toast } from "@core/app-shadcn/use-toast";

export const useGetStreamUpdateChannel = (selectedUsers: StreamChatUser[]) => {
  const { client } = useChatContext();
  const { user: loggedInUser } = useSession();

  const mutate = useMutation({
    mutationFn: async () => {
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
    },
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
