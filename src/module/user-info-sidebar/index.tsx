import { validateRequest } from "@app/api/_core/lucia-auth";
import { UserData } from "@app/api/users/user.query";

import { Linkify } from "@core/app-vendor/linkify";

import { UserAvatar } from "@module/app-global/navbar";
import { FollowButton } from "@module/follow-btn";
import { TooltipUser } from "@module/tooltip-user";

interface UserInfoSidebarProps {
  user: UserData;
}

export async function UserInfoSidebar({ user }: UserInfoSidebarProps) {
  const { user: loggedInUser } = await validateRequest();

  if (!loggedInUser) return null;

  // Demo suspense ở page/posts/[postId]
  // khi có gọi thêm 1 data riêng
  await new Promise(resolve => setTimeout(resolve, 2000));

  return (
    <div className="space-y-5 rounded-2xl bg-card p-5 shadow-sm">
      <div className="text-xl font-bold">About this user</div>
      <TooltipUser user={user} className="flex items-center gap-3">
        <UserAvatar avatarUrl={user.avatarUrl} className="flex-none" />
        <div>
          <p className="line-clamp-1 break-all font-semibold hover:underline">
            {user.displayName}
          </p>
          <p className="line-clamp-1 break-all text-muted-foreground">
            @{user.username}
          </p>
        </div>
      </TooltipUser>

      <Linkify>
        <div className="line-clamp-6 whitespace-pre-line break-words text-muted-foreground">
          {user.bio}
        </div>
      </Linkify>

      {user.id !== loggedInUser.id && (
        <FollowButton
          userId={user.id}
          initialState={{
            followers: user._count.followers,
            isFollowedByUser: user.followers.some(
              ({ followerId }) => followerId === loggedInUser.id,
            ),
          }}
        />
      )}
    </div>
  );
}
