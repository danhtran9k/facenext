import { Metadata } from "next";

import { validateRequest } from "@app/api/_core/lucia-auth";

import { TrendsSidebar } from "@module/app-global/trend-sidebar";

import { UserPosts } from "@module/user-posts";
import { UserProfile } from "@module/user-profile";

import { getUserProfile } from "./getUserProfile.query";

interface PageProps {
  params: { username: string };
}

export async function generateMetadata({
  params: { username },
}: PageProps): Promise<Metadata> {
  const { user: loggedInUser } = await validateRequest();

  if (!loggedInUser) return {};

  const user = await getUserProfile(username, loggedInUser.id);

  return {
    title: `${user.displayName} (@${user.username})`,
  };
}

export default async function Page({ params: { username } }: PageProps) {
  const { user: loggedInUser } = await validateRequest();
  // Bản chất user get từ lucia sẽ chỉ có min data
  // Nếu cần full user with relation data thì phải query prisma đàng hoàng
  // tuy nhiên user đang loggin ko liên quan gì tới profile user đang xem xét

  if (!loggedInUser) {
    return (
      <p className="text-destructive">
        You&apos;re not authorized to view this page.
      </p>
    );
  }

  // đây là profile user đang xem, ko phải là profile của loggin user
  const user = await getUserProfile(username, loggedInUser.id);

  // TrendSide bar thực chất có thể đẩy vào layout
  // tuy nhiên ko cần thiết do có thể 1 số route sẽ ko cần show
  return (
    <main className="flex w-full min-w-0 gap-5">
      <div className="w-full min-w-0 space-y-5">
        <UserProfile user={user} loggedInUserId={loggedInUser.id} />
        <div className="rounded-2xl bg-card p-5 shadow-sm">
          <h2 className="text-center text-2xl font-bold">
            {user.displayName}&apos;s posts
          </h2>
        </div>
        <UserPosts userId={user.id} />
      </div>
      <TrendsSidebar />
    </main>
  );
}
