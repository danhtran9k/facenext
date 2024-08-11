import { UTApi } from "uploadthing/server";

import prisma from "@app/api/_core/prisma";
import { getUploadthingKey } from "@app/api/_core/server.helper";

// Nếu chưa deploy có thể tự dùng Postman gửi kèm token header để manual gọi api ko qua cronjob
export async function GET(req: Request) {
  try {
    const authHeader = req.headers.get("Authorization");

    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      return Response.json(
        { message: "Invalid authorization header" },
        { status: 401 },
      );
    }

    // set array rỗng tức ở dev -> delete ngay lập tức khi cronjob chạy
    const createdAtSelect =
      process.env.NODE_ENV === "production"
        ? {
            createdAt: {
              lte: new Date(Date.now() - 1000 * 60 * 60 * 24),
            },
          }
        : {};

    const unusedMedia = await prisma.media.findMany({
      where: {
        postId: null,
        ...createdAtSelect,
      },
      select: {
        id: true,
        url: true,
      },
    });

    new UTApi().deleteFiles(unusedMedia.map(m => getUploadthingKey(m.url)));

    await prisma.media.deleteMany({
      where: {
        id: {
          in: unusedMedia.map(m => m.id),
        },
      },
    });

    return new Response();
  } catch (error) {
    console.error(error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}
