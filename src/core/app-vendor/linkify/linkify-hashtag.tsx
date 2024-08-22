import Link from "next/link";
import { LinkIt } from "react-linkify-it";

import { TPureLayout } from "@core/types/common.props";

import { LINKIFY_REGEX_HASHTAG } from "./linkify-regex.helper";

export function LinkifyHashtag({ children }: TPureLayout) {
  return (
    <LinkIt
      regex={LINKIFY_REGEX_HASHTAG}
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
