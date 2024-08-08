import { useQuery } from "@tanstack/react-query";
import { HTTPError } from "ky";

import kyInstance from "@core/ky";
import { UserData } from "@core/prisma/user.query";

export const useUserByNameOrId = (username: string) => {
  return useQuery({
    queryKey: ["user-data", username],
    queryFn: () => kyInstance.get(`/api/users/${username}`).json<UserData>(),
    retry(failureCount, error) {
      if (error instanceof HTTPError && error.response.status === 404) {
        return false;
      }
      return failureCount < 3;
    },
    staleTime: Infinity,
  });
};
