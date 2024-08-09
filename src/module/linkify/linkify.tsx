import { PropsWithChildren } from "react";

import { LinkifyHashtag } from "./linkify-hashtag";
import { LinkifyUrl } from "./linkify-url";
import { LinkifyUsername } from "./linkify-username";

type TLinkifyProps = PropsWithChildren<{
  hasNestedTooltip?: boolean;
}>;

export function Linkify({ children, hasNestedTooltip = true }: TLinkifyProps) {
  return (
    <LinkifyUsername hasNestedTooltip={hasNestedTooltip}>
      <LinkifyHashtag>
        <LinkifyUrl>{children}</LinkifyUrl>
      </LinkifyHashtag>
    </LinkifyUsername>
  );
}
