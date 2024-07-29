"use client";

import { LogOutIcon, UserIcon } from "lucide-react";
import Link from "next/link";

import { cn } from "@core/utils";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@module/atom-shadcn/dropdown-menu";

import { useSession } from "@module/app-provider";
import { logout } from "@module/sign-out";

import UserAvatar from "../user-avatar";

interface UserButtonProps {
  className?: string;
}

export function UserDropdown({ className }: UserButtonProps) {
  const { user } = useSession();
  const urlProfile = `/users/${user.username}`;

  const handleLogout = () => {
    logout();
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className={cn("flex-none rounded-full", className)}>
          <UserAvatar avatarUrl={user.avatarUrl} size={40} />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuLabel>Logged in as @{user.username}</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <Link href={urlProfile}>
          <DropdownMenuItem>
            <UserIcon className="mr-2 size-4" />
            Profile
          </DropdownMenuItem>
        </Link>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleLogout}>
          <LogOutIcon className="mr-2 size-4" />
          Logout
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
