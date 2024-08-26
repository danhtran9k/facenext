import { useTheme } from "next-themes";

export const useStreamChatThemeClassName = () => {
  // https://ui.shadcn.com/docs/dark-mode/next
  const { resolvedTheme } = useTheme();

  // https://getstream.io/chat/docs/sdk/react/components/core-components/chat/#
  // https://getstream.io/chat/docs/sdk/react/theming/themingv2/#dark-and-light-themes
  return resolvedTheme === "dark"
    ? "str-chat__theme-dark"
    : "str-chat__theme-light";
};
