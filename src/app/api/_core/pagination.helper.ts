const DEFAULT_PAGE_LIMIT = 4;

// PAGINATION - helper
export const extractSearchParam = (searchParams: URLSearchParams) => {
  // req.nextUrl.searchParams
  // https://nextjs.org/docs/app/api-reference/functions/next-request#nexturl

  const cursor = searchParams.get("cursor") ?? undefined;
  const pageSize = Number(searchParams.get("limit")) || DEFAULT_PAGE_LIMIT;

  const q = searchParams.get("q") ?? "";
  const searchQuery = q.split(" ").join(" & ");

  return { cursor, pageSize, q, searchQuery };
};

export const getPagination = ({
  isNextCursor = true,
  cursor,
  pageSize,
}: {
  isNextCursor?: boolean;
  cursor?: string;
  pageSize: number;
}) => {
  const SORT_ORDER: "asc" | "desc" = isNextCursor ? "desc" : "asc";
  const paginateQuery = isNextCursor
    ? // có 2 style lấy dư 1 hoặc lấy vừa đủ với kiểu nextCursor
      // skip: cursor ? 1 : 0,
      // ko dùng skip vì take đã lấy dư 1, tự search thêm
      { take: pageSize + 1, cursor: cursor ? { id: cursor } : undefined }
    : { take: -pageSize - 1, cursor: cursor ? { id: cursor } : undefined };

  const getDataAndCursor = <T extends { id: string }>(data: T[]) => {
    // data.length < pageSize
    let paginateCursor: null | string | number = null;

    if (data.length > pageSize) {
      if (isNextCursor) {
        paginateCursor = data[pageSize].id;
      } else {
        // Vì đi lùi nên cursor sẽ là ele đầu tiên
        // > ở đây thực chất là > 1 đơn vị,
        // vì logic pagination đang lấy dư 1 ele
        paginateCursor = data[0].id;
        // const previousCursor = comments.length > pageSize ? comments[0].id : null;
      }
    }

    // !isNextCursor && data.length < pageSize
    let dataPaginate = data;

    if (isNextCursor) {
      // vì lấy dư + 1 nên phải slice và tính toán nextCursor lại
      dataPaginate = data.slice(0, pageSize);
    } else if (data.length > pageSize) {
      dataPaginate = data.slice(1);
    }

    return { dataPaginate, cursor: paginateCursor };
  };

  return { paginateQuery, getDataAndCursor, SORT_ORDER };
};

export const getPaginateSearchParams = (
  searchParams: URLSearchParams,
  isNextCursor = true,
) => {
  const { cursor, pageSize, q, searchQuery } = extractSearchParam(searchParams);

  const { getDataAndCursor, paginateQuery, SORT_ORDER } = getPagination({
    cursor,
    pageSize,
    isNextCursor,
  });

  return {
    getDataAndCursor,
    paginateQuery,
    SORT_ORDER,
    // export ra cho đủ chứ nếu cần dùng riêng thì xài hàm nhỏ hơn
    cursor,
    pageSize,
    q,
    searchQuery,
  };
};
