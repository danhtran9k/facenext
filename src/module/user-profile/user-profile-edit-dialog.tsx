"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@core/app-shadcn/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@core/app-shadcn/form";
import { Input } from "@core/app-shadcn/input";
import { Label } from "@core/app-shadcn/label";
import { Textarea } from "@core/app-shadcn/textarea";

import {
  UpdateUserProfileValues,
  updateUserProfileSchema,
} from "@app/api/users/update/update-user-profile.dto";
import { useUpdateProfileMutation } from "@app/api/users/update/use-update-user-profile.mutate";
import { UserData } from "@app/api/users/user.query";
import avatarPlaceholder from "@app/assets/avatar-placeholder.png";

import LoadingButton from "@module/app-common/loading-btn";

import { UserProfileAvatarUpload } from "./user-profile-avatar-upload";

interface UserProfileEditDialogProps {
  user: UserData;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function UserProfileEditDialog({
  user,
  open,
  onOpenChange,
}: UserProfileEditDialogProps) {
  const form = useForm<UpdateUserProfileValues>({
    resolver: zodResolver(updateUserProfileSchema),
    defaultValues: {
      displayName: user.displayName,
      bio: user.bio ?? "",
    },
  });

  const { mutate, isPending } = useUpdateProfileMutation();
  const [srcAvatar, setSrcAvatar] = useState<Blob | null>(null);

  async function onSubmit(values: UpdateUserProfileValues) {
    const currTime = new Date().getTime();

    const newAvatarFile = srcAvatar
      ? new File([srcAvatar], `avatar_${user.id}_${currTime}.webp`)
      : undefined;

    mutate(
      {
        values,
        avatar: newAvatarFile,
      },
      {
        onSuccess: () => {
          onOpenChange(false);
          setSrcAvatar(null);
        },
      },
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit profile</DialogTitle>
          <DialogDescription />
        </DialogHeader>
        <div className="space-y-1.5">
          <Label>Avatar</Label>
          <UserProfileAvatarUpload
            src={
              srcAvatar
                ? URL.createObjectURL(srcAvatar)
                : (user.avatarUrl ?? avatarPlaceholder)
            }
            setSrc={setSrcAvatar}
          />
        </div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">
            <FormField
              control={form.control}
              name="displayName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Display name</FormLabel>
                  <FormControl>
                    <Input placeholder="Your display name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="bio"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Bio</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Tell us a little bit about yourself"
                      className="resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <LoadingButton type="submit" loading={isPending}>
                Save
              </LoadingButton>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
