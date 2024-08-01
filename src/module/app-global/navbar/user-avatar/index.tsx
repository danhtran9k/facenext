import Image from "next/image";

import avatarPlaceholder from "@app/assets/avatar-placeholder.png";

import { cn } from "@core/utils";

interface UserAvatarProps {
  avatarUrl: string | null | undefined;
  size?: number;
  className?: string;
}

// ref https://ui.shadcn.com/docs/components/avatar
// tuy nhiên thư viện lại dùng react-avatar của radix
// tham khảo tailwind class và tự viết lại
export default function UserAvatar({
  avatarUrl,
  size,
  className,
}: UserAvatarProps) {
  return (
    <Image
      src={avatarUrl ?? avatarPlaceholder}
      alt="User avatar"
      width={size ?? 48}
      height={size ?? 48}
      className={cn(
        "aspect-square h-fit flex-none rounded-full bg-secondary object-cover",
        className,
      )}
    />
  );
}
