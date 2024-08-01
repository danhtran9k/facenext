import { redirect } from "next/navigation";

import { validateRequest } from "@core/lucia-auth";
import { TPureLayout } from "@core/types/common.props";

import { SessionProvider } from "@module/app-provider";

import { BottomMenu } from "@module/app-global/bottom-menu";
import { Navbar } from "@module/app-global/navbar";
import { SideMenu } from "@module/app-global/side-menu";

export default async function Layout({ children }: TPureLayout) {
  // Vì validateRequest được cache lại nên nhiếu component gọi trong 1 lượt request ko sao -> được de-duplicate
  // Tuy nhiên khi các child component gọi thì đã là request khác
  // -> cần setup provider đẩy xuống để child ko gọi thêm
  const session = await validateRequest();

  if (!session.user) redirect("/login");

  // control hidden qua css, sv vẫn phải trả về, vẫn render ra nhưng ko show
  // tuỳ, ko hay lắm nhưng tạm skip, vì ko cần effect để tính toán nên trade-off
  // flex-grow:1 ?
  return (
    <SessionProvider value={session}>
      <div className="flex min-h-screen flex-col">
        <Navbar />
        <div className="mx-auto flex w-full max-w-7xl grow gap-5 p-5">
          <SideMenu className="hidden sm:block" />
          {children}
        </div>
        <BottomMenu className="sm:hidden" />
      </div>
    </SessionProvider>
  );
}
