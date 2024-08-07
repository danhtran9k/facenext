import { TPureLayout } from "@core/types/common.props";

import { LinkifyHashtag } from "./linkify-hashtag";
import { LinkifyUrl } from "./linkify-url";
import { LinkifyUsername } from "./linkify-username";

export function Linkify({ children }: TPureLayout) {
  return (
    <LinkifyUsername>
      <LinkifyHashtag>
        <LinkifyUrl>{children}</LinkifyUrl>
      </LinkifyHashtag>
    </LinkifyUsername>
  );
}
