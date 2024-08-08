import Link from "next/link";

import { validateRequest } from "@app/api/_core/lucia-auth";
import prisma from "@app/api/_core/prisma";
import { userDataSelect } from "@app/api/users/user.query";

import { UserAvatar } from "@module/app-global/navbar";
import { FollowButton } from "@module/follow-btn";
import { TooltipUser } from "@module/tooltip-user";

export async function WhoToFollow() {
  const { user } = await validateRequest();

  if (!user) return null;

  const usersToFollow = await prisma.user.findMany({
    where: {
      NOT: {
        id: user.id,
      },
      // https://www.prisma.io/docs/orm/reference/prisma-client-reference
      // check where - NOT - none
      // not chỉ dùng cho equal, none cho relation
      followers: {
        none: {
          followerId: user.id,
        },
      },
    },
    select: userDataSelect(user.id),
    take: 5,
  });

  // bản chất gốc component này chỉ show những ai chưa follow
  return (
    <div className="space-y-5 rounded-2xl bg-card p-5 shadow-sm">
      <div className="text-xl font-bold">Who to follow</div>
      {usersToFollow.map(user => (
        <div key={user.id} className="flex items-center justify-between gap-3">
          <TooltipUser user={user} className="flex items-center gap-3">
            <UserAvatar avatarUrl={user.avatarUrl} className="flex-none" />
            <div>
              <p className="line-clamp-1 break-all font-semibold hover:underline">
                {user.displayName} - [{user._count.followers}]
              </p>
              <p className="line-clamp-1 break-all text-muted-foreground">
                @{user.username}
              </p>
            </div>
          </TooltipUser>

          <FollowButton
            userId={user.id}
            initialState={{
              // props truyền thừa, ko sử dụng trong component trừ việc tạo dummy initial
              followers: user._count.followers,
              // bản chất query ở trên đã có none sẵn, hơi lỏ
              // code đoạn này cứ kì kì
              // thực chất qua query thì isFollowedByUser = false initial sẵn
              // logic này set vô chỉ để khi muốn mở rộng gì thêm, hơi thừa
              isFollowedByUser: user.followers.some(
                ({ followerId }) => followerId === user.id,
              ),
            }}
          />
        </div>
      ))}
    </div>
  );
}
