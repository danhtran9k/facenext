"use client";

import { useQueryClient } from "@tanstack/react-query";
import { LogOutIcon, UserIcon } from "lucide-react";
import Link from "next/link";

import { useSession } from "@core/app-provider";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@core/app-shadcn/dropdown-menu";
import { cn } from "@core/utils";

import { logout } from "@module/sign-out";

import { ThemeDropdownSubmenu } from "../theme-dropdown-submenu";
import { UserAvatar } from "../user-avatar";

interface UserButtonProps {
  className?: string;
}

export function UserDropdown({ className }: UserButtonProps) {
  const { user } = useSession();
  const urlProfile = `/users/${user.username}`;

  const queryClient = useQueryClient();

  // clear all query cache client side when logout
  const handleLogout = () => {
    queryClient.clear();
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

        <ThemeDropdownSubmenu />

        <DropdownMenuSeparator />

        <DropdownMenuItem onClick={handleLogout}>
          <LogOutIcon className="mr-2 size-4" />
          Logout
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
