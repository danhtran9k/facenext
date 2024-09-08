import { useQuery } from "@tanstack/react-query";
import { HTTPError } from "ky";

import kyInstance from "@app/api/_core/ky";
import { keysUser } from "@app/api/_core/queryKey";

import { UserData } from "@app/api/users/user.query";

export const useUserByNameOrId = (username: string, enabled = true) => {
  return useQuery({
    queryKey: keysUser.key(username),
    queryFn: () => kyInstance.get(keysUser.api(username)).json<UserData>(),
    retry(failureCount, error) {
      if (error instanceof HTTPError && error.response.status === 404) {
        return false;
      }
      return failureCount < 3;
    },
    staleTime: Infinity,
    enabled,
  });
};
