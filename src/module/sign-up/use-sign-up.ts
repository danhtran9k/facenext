import { zodResolver } from "@hookform/resolvers/zod";
import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";

import { signUp } from "./sign-up.action";
import { signUpSchema, SignUpValues } from "./sign-up.dto";

// https://ui.shadcn.com/docs/components/form#define-a-form
export const useSignUp = () => {
  const [error, setError] = useState<string>();
  const [isPending, startTransition] = useTransition();
  // Phải wrap vào để pending ko tắt trước khi server action navigate

  // cả 2 solution react client đều bị flash pending state
  // const [isPending, setIsPending] = useState(false);
  // const isPending = form.formState.isPending;

  const form = useForm<SignUpValues>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      email: "",
      username: "",
      password: "",
    },
  });

  async function onSubmit(values: SignUpValues) {
    setError(undefined);
    startTransition(async () => {
      const { error } = await signUp(values);
      if (error) setError(error);
    });

    // old client flow, flash ui stop pending and navigate
    // setIsPending(true);
    // await signUp(values);
    // setIsPending(false);
  }

  return {
    form,
    onSubmit,
    error,
    isPending,
  };
};
