import { LinkIt } from "react-linkify-it";

import { TPureLayout } from "@core/types/common.props";

import { LinkifyUsernameTooltip } from "./linkify-username-tooltip";

export function LinkifyUsername({ children }: TPureLayout) {
  // slice(1) is the username without the @ symbol
  return (
    <LinkIt
      regex={/(@[a-zA-Z0-9_-]+)/}
      component={(match, key) => (
        <LinkifyUsernameTooltip key={key} username={match.slice(1)}>
          {match}
        </LinkifyUsernameTooltip>
      )}
    >
      {children}
    </LinkIt>
  );
}
