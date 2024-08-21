import { Metadata } from "next";

import { TrendsSidebar } from "@module/app-global/trend-sidebar";
import { NotificationList } from "@module/notification-list";

export const metadata: Metadata = {
  title: "Notifications",
};

export default function Page() {
  return (
    <main className="flex w-full min-w-0 gap-5">
      <div className="w-full min-w-0 space-y-5">
        <div className="rounded-2xl bg-card p-5 shadow-sm">
          <h1 className="text-center text-2xl font-bold">Notifications</h1>
        </div>
        <NotificationList />
      </div>
      <TrendsSidebar />
    </main>
  );
}
