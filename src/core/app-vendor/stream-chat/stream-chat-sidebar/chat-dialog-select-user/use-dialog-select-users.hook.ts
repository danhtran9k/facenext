import { useCallback, useState } from "react";

import { StreamChatUser } from "@app/api/chat-token/getStream.type";

export const useDialogSelectUsers = () => {
  const [selectedUsers, setSelectedUsers] = useState<StreamChatUser[]>([]);

  const getRemoveUserHandler = useCallback(
    (user: StreamChatUser) => () => {
      setSelectedUsers(prev => prev.filter(u => u.id !== user.id));
    },
    [],
  );

  // bản chất là toggle ra khỏi current tagList
  // Có thể dùng slice index để bớt 1 vòng loop
  const getSelectUserHandler = useCallback(
    (user: StreamChatUser) => () => {
      setSelectedUsers(prev =>
        prev.some(u => u.id === user.id)
          ? prev.filter(u => u.id !== user.id)
          : [...prev, user],
      );
    },
    [],
  );

  return {
    selectedUsers,
    getRemoveUserHandler,
    getSelectUserHandler,
  };
};
