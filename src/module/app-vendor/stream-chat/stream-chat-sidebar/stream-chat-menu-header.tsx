"use client";

import { MailPlus, X } from "lucide-react";
import { useState } from "react";

import { Button } from "@core/app-shadcn/button";

import { useChatSidebar } from "@module/app-vendor/stream-chat";

import { NewChatDialog } from "./chat-dialog-select-user";

export function StreamChatMenuHeader() {
  const [showNewChatDialog, setShowNewChatDialog] = useState(false);
  const { setSidebarClose } = useChatSidebar();

  const handleNewChatCreated = () => {
    setShowNewChatDialog(false);
    setSidebarClose();
  };

  return (
    <>
      <div className="flex items-center gap-3 p-2">
        <div className="h-full md:hidden">
          <Button size="icon" variant="ghost" onClick={setSidebarClose}>
            <X className="size-5" />
          </Button>
        </div>
        <h1 className="me-auto text-xl font-bold md:ms-2">Messages</h1>
        <Button
          size="icon"
          variant="ghost"
          title="Start new chat"
          onClick={() => setShowNewChatDialog(true)}
        >
          <MailPlus className="size-5" />
        </Button>
      </div>
      {showNewChatDialog && (
        <NewChatDialog
          onOpenChange={setShowNewChatDialog}
          onChatCreated={handleNewChatCreated}
        />
      )}
    </>
  );
}
