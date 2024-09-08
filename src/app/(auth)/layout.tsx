import { redirect } from "next/navigation";

import { PATH_URL } from "@core/path.const";
import { TPureLayout } from "@core/types/common.props";

import { validateRequest } from "@app/api/_core/lucia-auth";

// Validate trong Layout ko hay lắm, tuy nhiên là pp protect route style React-client
// proj này sẽ tạm test thử pp này, coi thử có vấn đề gì
// Đối với Next - đúng ra phải validate ở tầng middleware
export default async function AuthLayout({ children }: TPureLayout) {
  const { user } = await validateRequest();

  if (user) redirect(PATH_URL.ROOT);

  return <>{children}</>;
}
