import { TPureLayout } from "@core/types/common.props";

import { LinkifyHashtag } from "./linkify-hashtag";
import { LinkifyUrl } from "./linkify-url";

export function Linkify({ children }: TPureLayout) {
  return (
    <LinkifyHashtag>
      <LinkifyUrl>{children}</LinkifyUrl>
    </LinkifyHashtag>
  );
}
