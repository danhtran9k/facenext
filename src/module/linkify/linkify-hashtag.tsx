import Link from "next/link";
import { LinkIt } from "react-linkify-it";

import { TPureLayout } from "@core/types/common.props";

const REGEX_HASHTAG = /(#[a-zA-Z0-9]+)/;

export function LinkifyHashtag({ children }: TPureLayout) {
  return (
    <LinkIt
      regex={REGEX_HASHTAG}
      component={(match, key) => (
        <Link
          key={key}
          href={`/hashtag/${match.slice(1)}`}
          className="text-primary hover:underline"
        >
          {match}
        </Link>
      )}
    >
      {children}
    </LinkIt>
  );
}
