"use client";

import { X } from "lucide-react";

import { StreamChatUser } from "@app/api/chat/getStream.type";

import { UserAvatar } from "@module/app-common/user-avatar";

interface SelectedUserTagProps {
  selectedUsers: StreamChatUser[];
  getHandleUserRemove: (user: StreamChatUser) => () => void;
}

export function SelectedUserTagList({
  selectedUsers,
  getHandleUserRemove,
}: SelectedUserTagProps) {
  return (
    !!selectedUsers.length && (
      <div className="mt-4 flex flex-wrap gap-2 p-2">
        {selectedUsers.map(user => (
          <button
            key={user.id}
            onClick={getHandleUserRemove(user)}
            className="flex items-center gap-2 rounded-full border p-1 hover:bg-muted/50"
          >
            <UserAvatar avatarUrl={user.image} size={24} />
            <p className="font-bold">{user.name}</p>
            <X className="mx-2 size-5 text-muted-foreground" />
          </button>
        ))}
      </div>
    )
  );
}
