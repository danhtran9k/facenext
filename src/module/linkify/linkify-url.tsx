import { LinkItUrl } from "react-linkify-it";

import { TPureLayout } from "@core/types/common.props";

export function LinkifyUrl({ children }: TPureLayout) {
  return (
    <LinkItUrl className="text-primary hover:underline">{children}</LinkItUrl>
  );
}
