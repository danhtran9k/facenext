import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { signUpSchema, SignUpValues } from "./sign-up.dto";

// https://ui.shadcn.com/docs/components/form#define-a-form
export const useSignUp = () => {
  const form = useForm<SignUpValues>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      email: "",
      username: "",
      password: "",
    },
  });

  async function onSubmit(values: SignUpValues) {}

  return {
    form,
    onSubmit,
  };
};
