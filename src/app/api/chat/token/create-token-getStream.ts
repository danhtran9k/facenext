// server only

import { User } from "lucia";

import { streamServerClient } from "@app/api/_core/getStream-instance";

const currentTimeInSecond = () => Math.floor(Date.now() / 1000);
const ONE_MINUTE_IN_SECOND = 60;
const ONE_HOUR_IN_SECOND = 60 * ONE_MINUTE_IN_SECOND;

export const createTokenGetStream = (user: User) => {
  // Việc setIssueAt lùi về 1m hơi hacky, tuy nhiên tạm skip
  const expirationTime = currentTimeInSecond() + ONE_HOUR_IN_SECOND;
  const issuedAt = currentTimeInSecond() - ONE_MINUTE_IN_SECOND;

  // https://getstream.io/chat/docs/node/tokens_and_authentication/?language=javascript
  const token = streamServerClient.createToken(
    user.id,
    expirationTime,
    issuedAt,
  );

  return token;
};
