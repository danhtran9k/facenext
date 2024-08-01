import Link from "next/link";

import SearchField from "@module/app-form/search-field";

import { UserDropdown } from "../user-dropdown";

export function Navbar() {
  return (
    <header className="sticky top-0 z-10 bg-card shadow-sm">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-center gap-5 px-5 py-3">
        <Link href="/" className="text-2xl font-bold text-primary">
          bugbook
        </Link>
        <SearchField />
        <UserDropdown className="sm:ms-auto" />
      </div>
    </header>
  );
}
