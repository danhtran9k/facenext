import { formatDate, formatDistanceToNowStrict } from "date-fns";

import { DAY_IN_MS } from "@core/app.const";

export function formatRelativeDate(from: Date) {
  // Nếu dùng .json() từ native fetch thì date sẽ là string
  if (typeof from === "string") {
    from = new Date(from);
  }

  const currentDate = new Date();

  if (currentDate.getTime() - from.getTime() < DAY_IN_MS) {
    return formatDistanceToNowStrict(from, { addSuffix: true });
  }

  if (currentDate.getFullYear() === from.getFullYear()) {
    return formatDate(from, "MMM d");
  } else {
    return formatDate(from, "MMM d, yyy");
  }
}
