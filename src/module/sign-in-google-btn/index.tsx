import { GoogleIcon } from "@core/app-icon";
import { Button } from "@core/app-shadcn/button";
import { URL_AUTH } from "@core/url.const";

export default function GoogleSignInButton() {
  // NOTE: ko dùng Link của next/Link mà phải dùng a tag
  // Next Link sẽ mess up server side redirect TH này -> có error popup
  return (
    <Button
      variant="outline"
      className="bg-white text-black hover:bg-gray-100 hover:text-black"
      asChild
    >
      <a
        href={URL_AUTH.GOOGLE_LOGIN}
        className="flex w-full items-center gap-2"
      >
        <GoogleIcon />
        Sign in with Google
      </a>
    </Button>
  );
}