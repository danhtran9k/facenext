import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

import signupImage from "@app/assets/signup-image.jpg";

import { SignUpForm } from "@module/sign-up/form";

export const metadata: Metadata = {
  title: "Sign Up",
};

export default function Page() {
  // overflow-hidden kết họp image object-cover để hình tự hide khi flow lố
  // overflow-y-auto để scroll khi nội dung quá dài hoặc error dài
  return (
    <main className="flex h-screen items-center justify-center p-5">
      <div className="flex h-full max-h-[40rem] w-full max-w-[64rem] overflow-hidden rounded-2xl bg-card shadow-2xl">
        <div className="w-full space-y-10 overflow-y-auto p-10 md:w-1/2">
          <div className="space-y-1 text-center">
            <h1 className="text-3xl font-bold">Sign up to bugbook</h1>
            <p className="text-muted-foreground">
              A place where even <span className="italic">you</span> can find a
              friend.
            </p>
          </div>
          <div className="space-y-5">
            <SignUpForm />
            <Link href="/login" className="block text-center hover:underline">
              Already have an account? Log in
            </Link>
          </div>
        </div>
        <Image
          src={signupImage}
          alt=""
          className="hidden w-1/2 object-cover md:block"
        />
      </div>
    </main>
  );
}