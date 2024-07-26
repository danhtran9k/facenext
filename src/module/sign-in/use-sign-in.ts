import { zodResolver } from "@hookform/resolvers/zod";
import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";

import { signIn } from "./sign-in.action";
import { SignInValues, signInSchema } from "./sign-in.dto";

// https://ui.shadcn.com/docs/components/form#define-a-form
export const useSignIn = () => {
  const [error, setError] = useState<string>();
  const [isPending, startTransition] = useTransition();

  const form = useForm<SignInValues>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  async function onSubmit(values: SignInValues) {
    setError(undefined);
    startTransition(async () => {
      const { error } = await signIn(values);
      if (error) setError(error);
    });
  }

  return {
    form,
    onSubmit,
    error,
    isPending,
  };
};
