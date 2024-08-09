import { PropsWithChildren } from "react";
import { LinkIt } from "react-linkify-it";

import { LINKIFY_REGEX_MENTION } from "./linkify-regex.helper";
import { LinkifyUsernameTooltip } from "./linkify-username-tooltip";

type TLinkifyUsernameProps = PropsWithChildren<{
  hasNestedTooltip?: boolean;
}>;

export function LinkifyUsername({
  children,
  hasNestedTooltip = true,
}: TLinkifyUsernameProps) {
  // slice(1) is the username without the @ symbol
  return (
    <LinkIt
      regex={LINKIFY_REGEX_MENTION}
      component={(match, key) => (
        <LinkifyUsernameTooltip
          key={key}
          username={match.slice(1)}
          hasNestedTooltip={hasNestedTooltip}
        >
          {match}
        </LinkifyUsernameTooltip>
      )}
    >
      {children}
    </LinkIt>
  );
}
