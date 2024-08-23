import { INTERNAL_ERROR, UNAUTHORIZED_ERROR } from "@app/api/_core/api.common";
import { validateRequest } from "@app/api/_core/lucia-auth";
import prisma from "@app/api/_core/prisma";

// Ý tưởng tạm basic là khi vào trang list noti
// -> tự mark tất cả là read
// Khá tệ
// TODO: có thể improve -> check sau

// Nếu chuyển thành server action thì phải cẩn thận
// Server action behavior vì server action phải wait lẫn nhau + block navigate
// Đúng ra chỉ call trong background

// Nhưng cả server action cũng ko khác phục được điểm yếu ban đầu
export async function PATCH() {
  try {
    const { user } = await validateRequest();

    if (!user) {
      return UNAUTHORIZED_ERROR;
    }

    await prisma.notification.updateMany({
      where: {
        recipientId: user.id,
        read: false,
      },
      data: {
        read: true,
      },
    });

    return new Response();
  } catch (error) {
    console.error(error);
    return INTERNAL_ERROR;
  }
}
