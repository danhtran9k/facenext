"use client";

import { SearchIcon } from "lucide-react";
import { useRouter } from "next/navigation";

import { Input } from "@module/atom-shadcn/input";

export default function SearchField() {
  const router = useRouter();

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    // dù Input của shadcn nhưng value sẽ tự lấy theo style html-js thuần
    // vì form đơn giản, ko cần bọc hook-form
    e.preventDefault();
    // prevent form reload
    const form = e.currentTarget;
    // name="q" của input
    const q = (form.q as HTMLInputElement).value.trim();
    if (!q) return;
    router.push(`/search?q=${encodeURIComponent(q)}`);
  }

  //  method="GET" action="/search -> chỉ setup khi js bị disable trên browser
  // hơi thừa, chỉ demo feature
  return (
    <form onSubmit={handleSubmit} method="GET" action="/search">
      <div className="relative">
        <Input name="q" placeholder="Search" className="pe-10" />
        <SearchIcon className="absolute right-3 top-1/2 size-5 -translate-y-1/2 transform text-muted-foreground" />
      </div>
    </form>
  );
}
