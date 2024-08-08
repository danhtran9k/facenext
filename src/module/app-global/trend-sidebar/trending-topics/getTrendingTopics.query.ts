import { unstable_cache } from "next/cache";

import prisma from "@app/api/_core/prisma";

import { HOUR_IN_MS, MS_SECOND } from "@core/app.const";

// https://nextjs.org/docs/app/api-reference/functions/unstable_cache
// TODO: raw query - tạm skip

export const getTrendingTopics = unstable_cache(
  async () => {
    const result = await prisma.$queryRaw<{ hashtag: string; count: bigint }[]>`
              SELECT LOWER(unnest(regexp_matches(content, '#[[:alnum:]_]+', 'g'))) AS hashtag, COUNT(*) AS count
              FROM posts
              GROUP BY (hashtag)
              ORDER BY count DESC, hashtag ASC
              LIMIT 5
          `;

    return result.map(row => ({
      hashtag: row.hashtag,
      count: Number(row.count),
    }));
  },
  ["trending_topics"],
  {
    revalidate: (3 * HOUR_IN_MS) / MS_SECOND, // minutes
  },
);
