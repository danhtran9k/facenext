import { Eye, EyeOff } from "lucide-react";
import React, { useState } from "react";

import { cn } from "@core/utils";

import { Input, InputProps } from "@module/atom-shadcn/input";

// ref drilling - vì Input shadcn hoạt động dựa trên ref
const PasswordInput = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, placeholder = "Password", ...props }, ref) => {
    const [showPassword, setShowPassword] = useState(false);

    return (
      <div className="relative">
        <Input
          type={showPassword ? "text" : "password"}
          className={cn("pe-10", className)}
          ref={ref}
          placeholder={placeholder}
          {...props}
        />
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          title={showPassword ? "Hide password" : "Show password"}
          className="absolute right-3 top-1/2 -translate-y-1/2 transform text-muted-foreground"
        >
          {showPassword ? (
            <EyeOff className="size-5" />
          ) : (
            <Eye className="size-5" />
          )}
        </button>
      </div>
    );
  },
);

PasswordInput.displayName = "PasswordInput";

export { PasswordInput };