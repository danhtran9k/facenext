import { createUploadthing, type FileRouter } from "uploadthing/next";
import { UploadThingError, UTApi } from "uploadthing/server";

import { streamServerClient } from "@app/api/_core/getStream-instance";
import { validateRequest } from "@app/api/_core/lucia-auth";
import prisma from "@app/api/_core/prisma";
import { UPLOADTHING_PATH } from "@app/api/_core/server.helper";

import { MAX_UPLOAD_FILE_COUNT } from "@core/app.const";

const f = createUploadthing();

// https://docs.uploadthing.com/getting-started/appdir#creating-your-first-fileroute

// FileRouter for your app, can contain multiple FileRoutes
export const ourFileRouter = {
  // Define as many FileRoutes as you like, each with a unique routeSlug
  avatar: f({ image: { maxFileSize: "1MB" } })
    // Set permissions and file types for this FileRoute
    .middleware(async () => {
      // This code runs on your server before upload
      const { user } = await validateRequest();

      // If you throw, the user will not be able to upload
      if (!user) throw new UploadThingError("Unauthorized");

      // Whatever is returned here is accessible in onUploadComplete as `metadata`
      return { user };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      // delete old avatar image to save space
      const oldAvatarUrl = metadata.user.avatarUrl;
      if (oldAvatarUrl) {
        const key = oldAvatarUrl.split(UPLOADTHING_PATH)[1];
        await new UTApi().deleteFiles(key);
      }

      // This code RUNS ON YOUR SERVER after upload
      const newAvatarUrl = file.url.replace("/f/", UPLOADTHING_PATH);

      // TODO: thật ra user update xong là ổn, bản thận getStream ko revert lại được
      // revert prisma lại vô nghĩa
      // Chỗ này ko rõ solution ntn tốt
      await Promise.all([
        prisma.user.update({
          where: { id: metadata.user.id },
          data: {
            avatarUrl: newAvatarUrl,
          },
        }),
        streamServerClient.partialUpdateUser({
          id: metadata.user.id,
          set: {
            image: newAvatarUrl,
          },
        }),
      ]);

      // !!! Whatever is returned here is sent to the clientside `onClientUploadComplete` callback
      return { avatarUrl: newAvatarUrl };
    }),
  // https://docs.uploadthing.com/api-reference/server#file-routes
  attachment: f({
    image: { maxFileSize: "4MB", maxFileCount: MAX_UPLOAD_FILE_COUNT },
    video: { maxFileSize: "16MB", maxFileCount: MAX_UPLOAD_FILE_COUNT },
  })
    // Set permissions and file types for this FileRoute
    .middleware(async () => {
      // This code runs on your server before upload
      const { user } = await validateRequest();

      // If you throw, the user will not be able to upload
      if (!user) throw new UploadThingError("Unauthorized");

      // Whatever is returned here is accessible in onUploadComplete as `metadata`
      return { user };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      // delete old avatar image to save space
      const url = file.url.replace("/f/", UPLOADTHING_PATH);
      const type = file.type.startsWith("image") ? "IMAGE" : "VIDEO";

      const media = await prisma.media.create({
        data: {
          url,
          type,
        },
      });

      // !!! Whatever is returned here is sent to the clientside `onClientUploadComplete` callback
      return { mediaId: media.id };
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
