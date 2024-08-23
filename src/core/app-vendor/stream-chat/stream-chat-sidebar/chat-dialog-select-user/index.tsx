"use client";

import { SearchIcon } from "lucide-react";
import { useState } from "react";
import { useChatContext } from "stream-chat-react";

import { useGetStreamUpdateChannel } from "@app/api/chat-token/use-get-stream-update-channel";

import { useDebounce } from "@core/app-hook/use-debounce";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@core/app-shadcn/dialog";

import LoadingButton from "@module/app-common/loading-btn";

import { SelectedUserTagList } from "./select-user-tag-list";
import { useDialogSelectUsers } from "./use-dialog-select-users.hook";
import { UsersQueryList } from "./users-query-list";
interface NewChatDialogProps {
  onOpenChange: (open: boolean) => void;
  onChatCreated: () => void;
}

export function NewChatDialog({
  onOpenChange,
  onChatCreated,
}: NewChatDialogProps) {
  const { setActiveChannel } = useChatContext();

  const [searchInput, setSearchInput] = useState("");
  const searchInputDebounced = useDebounce(searchInput);

  // const [selectedUsers, setSelectedUsers] = useState<StreamChatUser[]>([]);
  const { getRemoveUserHandler, getSelectUserHandler, selectedUsers } =
    useDialogSelectUsers();

  const { mutate, isPending } = useGetStreamUpdateChannel(selectedUsers);
  const handleStartChat = () => {
    mutate(undefined, {
      onSuccess: channel => {
        setActiveChannel(channel);
        onChatCreated();
      },
    });
  };

  return (
    <Dialog open onOpenChange={onOpenChange}>
      <DialogContent className="bg-card p-0">
        <DialogHeader className="px-6 pt-6">
          <DialogTitle>New chat</DialogTitle>
        </DialogHeader>
        <div>
          <div className="group relative">
            <SearchIcon className="absolute left-5 top-1/2 size-5 -translate-y-1/2 transform text-muted-foreground group-focus-within:text-primary" />

            <input
              placeholder="Search users..."
              className="h-12 w-full pe-4 ps-14 focus:outline-none"
              value={searchInput}
              onChange={e => setSearchInput(e.target.value)}
            />
          </div>

          <SelectedUserTagList
            selectedUsers={selectedUsers}
            getHandleUserRemove={getRemoveUserHandler}
          />
          <hr />
        </div>

        <div className="h-96 overflow-y-auto">
          <UsersQueryList
            debounceInput={searchInputDebounced}
            selectedUsers={selectedUsers}
            getHandleUserSelect={getSelectUserHandler}
          />
        </div>

        <DialogFooter className="px-6 pb-6">
          <LoadingButton
            disabled={!selectedUsers.length}
            loading={isPending}
            onClick={handleStartChat}
          >
            Start chat
          </LoadingButton>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
