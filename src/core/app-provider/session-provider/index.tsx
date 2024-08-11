"use client";

import { Session, User } from "lucia";
import React, { createContext, useContext } from "react";

// https://medium.com/@colorsong.nabi/propswithchildren-vs-reactnode-in-typescript-c3182cbf7124
type TSessionProviderProps = React.PropsWithChildren<{ value: SessionContext }>;

interface SessionContext {
  user: User;
  session: Session;
}

export function SessionProvider({ children, value }: TSessionProviderProps) {
  return (
    <SessionContext.Provider value={value}>{children}</SessionContext.Provider>
  );
}

const SessionContext = createContext<SessionContext | null>(null);

export function useSession() {
  const context = useContext(SessionContext);
  // trick để enforce type khi sử dụng trong các component khác
  if (!context) {
    throw new Error("useSession must be used within a SessionProvider");
  }
  return context;
}
