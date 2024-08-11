"use client";

import { useState } from "react";

import { UserData } from "@app/api/users/user.query";

import { Button } from "@core/app-shadcn/button";

import { UserProfileEditDialog } from "./user-profile-edit-dialog";

interface EditProfileButtonProps {
  user: UserData;
}

export default function UserProfileEditBtn({ user }: EditProfileButtonProps) {
  const [showDialog, setShowDialog] = useState(false);

  return (
    <>
      <Button variant="outline" onClick={() => setShowDialog(true)}>
        Edit profile
      </Button>
      <UserProfileEditDialog
        user={user}
        open={showDialog}
        onOpenChange={setShowDialog}
      />
    </>
  );
}
