"use client";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@core/app-shadcn/form";
import { Input } from "@core/app-shadcn/input";

import LoadingButton from "@module/app-common/loading-btn";
import { PasswordInput } from "@module/app-common/password-input";

import { useSignUp } from "./use-sign-up";

export function SignUpForm() {
  const { form, onSubmit, error, isPending } = useSignUp();

  // https://ui.shadcn.com/docs/components/form#build-your-form
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        {error && <p className="text-center text-destructive">{error}</p>}
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
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input placeholder="Email" type="email" {...field} />
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
        <LoadingButton loading={isPending} type="submit" className="w-full">
          Create account
        </LoadingButton>
      </form>
    </Form>
  );
}
