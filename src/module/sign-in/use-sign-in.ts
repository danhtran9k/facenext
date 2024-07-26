import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { SignInValues, signInSchema } from "./sign-in.dto";

// https://ui.shadcn.com/docs/components/form#define-a-form
export const useSignIn = () => {
  const form = useForm<SignInValues>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  async function onSubmit(values: SignInValues) {}

  return {
    form,
    onSubmit,
  };
};
