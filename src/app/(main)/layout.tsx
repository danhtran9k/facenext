import { redirect } from "next/navigation";

import { validateRequest } from "@core/lucia-auth";
import { TPureLayout } from "@core/types/common.props";

import { SessionProvider } from "@module/app-provider";
import { Navbar } from "@module/navbar";

export default async function Layout({ children }: TPureLayout) {
  // Vì validateRequest được cache lại nên nhiếu component gọi trong 1 lượt request ko sao -> được de-duplicate
  // Tuy nhiên khi các child component gọi thì đã là request khác
  // -> cần setup provider đẩy xuống để child ko gọi thêm
  const session = await validateRequest();

  if (!session.user) redirect("/login");

  return (
    <SessionProvider value={session}>
      <div className="flex min-h-screen flex-col">
        <Navbar />
        <div className="mx-auto max-w-7xl p-5">{children}</div>
      </div>
    </SessionProvider>
  );
}
