import { formatDate } from "date-fns";

import { formatNumber } from "@core/helper/number.utils";

import { FollowerInfo } from "@app/api/posts/post.prisma";
import { UserData } from "@app/api/users/user.query";

import { Linkify } from "@module/app-vendor/linkify";

import { UserAvatar } from "@module/app-global/navbar";
import { FollowButton } from "@module/follow-btn";
import { FollowerCount } from "@module/follower-count";

import UserProfileEditBtn from "./user-profile-edit-btn";

interface UserProfileProps {
  user: UserData;
  loggedInUserId: string;
}

// View profile của 1 user khác,
// đồng thời cũng check xem mình (loggined user) đã follow user đó chưa
export async function UserProfile({ user, loggedInUserId }: UserProfileProps) {
  const followerInfo: FollowerInfo = {
    followers: user._count.followers,
    isFollowedByUser: user.followers.some(
      ({ followerId }) => followerId === loggedInUserId,
    ),
  };

  // CSS_Note: https://developer.mozilla.org/en-US/docs/Web/CSS/margin-inline-end
  return (
    <div className="h-fit w-full space-y-5 rounded-2xl bg-card p-5 shadow-sm">
      <UserAvatar
        avatarUrl={user.avatarUrl}
        size={250}
        className="mx-auto size-full max-h-60 max-w-60 rounded-full"
      />
      <div className="flex flex-wrap gap-3 sm:flex-nowrap">
        <div className="me-auto space-y-3">
          <div>
            <h1 className="text-3xl font-bold">{user.displayName}</h1>
            <div className="text-muted-foreground">@{user.username}</div>
          </div>
          <div>Member since {formatDate(user.createdAt, "MMM d, yyyy")}</div>
          <div className="flex items-center gap-3">
            <span>
              Posts:{" "}
              <span className="font-semibold">
                {formatNumber(user._count.posts)}
              </span>
            </span>
            <FollowerCount userId={user.id} initialState={followerInfo} />
          </div>
        </div>
        {user.id === loggedInUserId ? (
          <UserProfileEditBtn user={user} />
        ) : (
          <FollowButton userId={user.id} initialState={followerInfo} />
        )}
      </div>
      {user.bio && (
        <>
          <hr />
          <Linkify>
            <div className="overflow-hidden whitespace-pre-line break-words">
              {user.bio}
            </div>
          </Linkify>
        </>
      )}
    </div>
  );
}
