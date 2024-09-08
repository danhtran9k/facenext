"use client";

import Link from "next/link";

import { useSession } from "@core/app-provider";
import { PATH_URL } from "@core/path.const";

import { FollowerInfo } from "@app/api/posts/post.prisma";
import { UserData } from "@app/api/users/user.query";

import { Linkify } from "@module/app-vendor/linkify";

import { UserAvatar } from "@module/app-global/navbar";
import { FollowButton } from "@module/follow-btn";
import { FollowerCount } from "@module/follower-count";

interface UserDataProps {
  user: UserData;
}

export function TooltipUserContent({ user }: UserDataProps) {
  const { user: loggedInUser } = useSession();

  const followerState: FollowerInfo = {
    followers: user._count.followers,
    isFollowedByUser: !!user.followers.some(
      ({ followerId }) => followerId === loggedInUser.id,
    ),
  };

  return (
    <div className="flex max-w-80 flex-col gap-3 break-words px-1 py-2.5 md:min-w-52">
      <div className="flex items-center justify-between gap-2">
        <Link href={PATH_URL.userProfile(user.username)}>
          <UserAvatar size={70} avatarUrl={user.avatarUrl} />
        </Link>
        {loggedInUser.id !== user.id && (
          <FollowButton userId={user.id} initialState={followerState} />
        )}
      </div>
      <div>
        <Link href={PATH_URL.userProfile(user.username)}>
          <div className="text-lg font-semibold hover:underline">
            {user.displayName}
          </div>
          <div className="text-muted-foreground">@{user.username}</div>
        </Link>
      </div>
      {user.bio && (
        <Linkify hasNestedTooltip={false}>
          <div className="line-clamp-4 whitespace-pre-line">{user.bio}</div>
        </Linkify>
      )}
      <FollowerCount userId={user.id} initialState={followerState} />
    </div>
  );
}
