import { Loader2 } from "lucide-react";
import { Metadata } from "next";
import { Suspense } from "react";

import { validateRequest } from "@app/api/_core/lucia-auth";
import { getPost } from "@app/api/posts/getPost.action";

import { PostItem } from "@module/post-item";
import { UserInfoSidebar } from "@module/user-info-sidebar";

interface PageProps {
  params: { postId: string };
}

export async function generateMetadata({
  params: { postId },
}: PageProps): Promise<Metadata> {
  const { user } = await validateRequest();

  if (!user) return {};

  const post = await getPost(postId, user.id);

  return {
    title: `${post.user.displayName}: ${post.content.slice(0, 50)}...`,
  };
}

export default async function Page({ params: { postId } }: PageProps) {
  const { user } = await validateRequest();

  if (!user) {
    return (
      <p className="text-destructive">
        You&apos;re not authorized to view this page.
      </p>
    );
  }

  const post = await getPost(postId, user.id);

  // Layout home và layout trong PostId khác nhau
  // Solution hiện tại đang code trực tiếp vào page để ko complecated lên (BWS)
  // responsive show hide cũng đang ko thống nhất với trend-sidebar

  // Nếu xem đây là 2 entities responsive khác nhau thì ok, ko cần thống nhất
  // TODO: Nếu chung 1 layout responsive thì cần refactor lại

  // Suspense hơi thừa vì bản chất đã là server component sẵn
  // Tuy nhiên check thực tế đang có vấn đề báo hydration
  // Tuy nhiên nếu trong userInfo lại fetch 1 data khác validateRequest thì cần Suspense !!!
  return (
    <main className="flex w-full min-w-0 gap-5">
      <div className="w-full min-w-0 space-y-5">
        <PostItem post={post} />
      </div>

      <div className="sticky top-[5.25rem] hidden h-fit w-80 flex-none lg:block">
        <Suspense fallback={<Loader2 className="mx-auto animate-spin" />}>
          <UserInfoSidebar user={post.user} />
        </Suspense>
      </div>
    </main>
  );
}
