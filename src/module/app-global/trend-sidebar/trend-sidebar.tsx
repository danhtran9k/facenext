import { Loader2 } from "lucide-react";
import { Suspense } from "react";

import { TrendingTopics } from "./trending-topics";
import { WhoToFollow } from "./who-to-follow";

export function TrendsSidebar() {
  // Reponsive dạng ẩn hiện ko nên hard-code thẳng vào component
  // hoặc phải nhận props classname từ parent vào để override lại

  return (
    <div className="hidden md:block">
      <div className="sticky top-[5.25rem] h-fit w-72 flex-none space-y-5 lg:w-80">
        <Suspense fallback={<Loader2 className="mx-auto animate-spin" />}>
          <WhoToFollow />
          <TrendingTopics />
        </Suspense>
      </div>
    </div>
  );
}
