"use client";

import {
  PropsWithChildren,
  createContext,
  useContext,
  useMemo,
  useState,
} from "react";

import { TChatSidebarContext, defaultSidebarContext } from "./chat.type";

// https://react.dev/reference/react/useContext#examples-basic

const ChatSidebarContext = createContext<TChatSidebarContext>(
  defaultSidebarContext,
);

export function ChatSidebarProvider({ children }: PropsWithChildren) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // https://react.dev/reference/react/useContext#optimizing-re-renders-when-passing-objects-and-functions
  const contextValue = useMemo(
    () => ({
      isSidebarOpen,
      setIsSidebarOpen,
      setSidebarOpen: () => setIsSidebarOpen(true),
      setSidebarClose: () => setIsSidebarOpen(false),
    }),
    [isSidebarOpen],
  );

  return (
    <ChatSidebarContext.Provider value={contextValue}>
      {children}
    </ChatSidebarContext.Provider>
  );
}

export const useChatSidebar = () => {
  const context = useContext(ChatSidebarContext);

  // // Nếu ko muốn define default value thì cần guard Context
  // Code boilerplate nhiều hơn
  // Hoặc dùng infer type tuy nhiên sẽ ko chặt chẽ chỗ type Dispatch

  // if (!context) {
  //   throw new Error("useChatSidebar must be used within a ChatSidebarProvider");
  // }

  return context;
};
