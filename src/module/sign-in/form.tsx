"use client";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@module/atom-shadcn/form";
import { Input } from "@module/atom-shadcn/input";
import LoadingButton from "@module/common/loading-btn";
import { PasswordInput } from "@module/common/password-input";

import { useSignIn } from "./use-sign-in";

export function SignInForm() {
  const { form, onSubmit } = useSignIn();

  // https://ui.shadcn.com/docs/components/form#build-your-form
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Username</FormLabel>
              <FormControl>
                <Input placeholder="Username" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <PasswordInput {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <LoadingButton loading={false} type="submit" className="w-full">
          Log in
        </LoadingButton>
      </form>
    </Form>
  );
}
