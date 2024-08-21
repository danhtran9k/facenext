"use server";

import { validateRequest } from "@app/api/_core/lucia-auth";
import prisma from "@app/api/_core/prisma";
import { getCommentDataInclude } from "@app/api/posts/[postId]/comment/comment.query";

export async function deleteComment(id: string) {
  const { user } = await validateRequest();

  if (!user) throw new Error("Unauthorized");

  const comment = await prisma.comment.findUnique({
    where: { id },
  });

  if (!comment) throw new Error("Comment not found");

  if (comment.userId !== user.id) throw new Error("Unauthorized");

  // delete comment sẽ ko show noti, xem như delete ngầm
  // Xử lý delete Comment noti khá phức tạp vì ko còn ref tham chiếu
  // Giá trị ko cao nhưng logic sẽ rất phức tạp, nhiều case dị vì phụ thuộc vào post cha
  const deletedComment = await prisma.comment.delete({
    where: { id },
    include: getCommentDataInclude(user.id),
  });

  // ngoài ra delete Comment cũng sẽ ko delete các noti liên quan
  // Vì trong db đang set ko có field CommentId, chỉ có PostId
  // Vấn đề cũng tương tự trên, setup thêm db nhưng impact ko quá nhiều
  // Cùng lắm khi user navigate vào post thì báo Post ko tồn tại là Ok
  return deletedComment;
}

export type TDeleteComment = Awaited<ReturnType<typeof deleteComment>>;
