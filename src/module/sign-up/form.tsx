"use client";

import { Button } from "@module/atom-shadcn/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@module/atom-shadcn/form";
import { Input } from "@module/atom-shadcn/input";

import { useSignUp } from "./use-sign-up";

export function SignUpForm() {
  const { form, onSubmit } = useSignUp();

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
              <FormDescription>
                This is your public display name.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">Submit</Button>
      </form>
    </Form>
  );
}
