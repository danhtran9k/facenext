import { Dispatch, SetStateAction } from "react";

export type TChatSidebarContext = {
  isSidebarOpen: boolean;
  setIsSidebarOpen: Dispatch<SetStateAction<boolean>>;
  setSidebarOpen: () => void;
  setSidebarClose: () => void;
};

// Optional -> check context for note
export const defaultSidebarContext = {
  isSidebarOpen: false,
  setIsSidebarOpen: () => {},
  setSidebarOpen: () => {},
  setSidebarClose: () => {},
};
