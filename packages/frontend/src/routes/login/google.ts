/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   google.ts                                          :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: abenamar <abenamar@student.42.fr>          +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2025/05/14 10:14:01 by abenamar          #+#    #+#             */
/*   Updated: 2025/08/18 04:02:35 by abenamar         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

import {
  accessTokenCookieName,
  mfaTokenCookieName,
  refreshTokenCookieName,
} from "#utils/api.js";
import { indexLayout, unauthorized } from "#utils/views.js";
import { FastifyPluginAsync } from "fastify";

type GoogleUserInfo = Readonly<{
  email: string;
  name: string;
  picture: string;
  sub: string;
}>;

const google: FastifyPluginAsync = async (scope) => {
  scope.register(
    async (scope) => {
      scope.addLayout(indexLayout(scope), {
        skipOnHeader: "hx-request",
      });
      scope.get(
        "/callback",
        { schema: { tags: ["auth"] } },
        async (req, reply) => {
          try {
            const oauth2Token =
              await scope.oauth2Google!.getAccessTokenFromAuthorizationCodeFlow(
                req,
                reply,
              );
            const oauth2TokenInfo = await scope.oauth2Google!.userinfo(
              oauth2Token.token,
            );
            const userInfo = oauth2TokenInfo as GoogleUserInfo;
            const response = await fetch(
              process.env.PAKE_MAN_BACKEND_URL! + "/api/v1/auth",
              {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({
                  google_id: userInfo.sub,
                  email: userInfo.email,
                  name: userInfo.name,
                  picture: userInfo.picture,
                }),
              },
            );

            if (!response.ok) {
              return unauthorized(req, reply);
            }

            if (response.status === 202) {
              const secondsIn10Minutes = 60 * 10;
              const epochIn10Minutes = Date.now() + secondsIn10Minutes * 1_000;
              const payload = await response.json();
              const data = payload as {
                mfa_token: string;
              };

              reply
                .setCookie(mfaTokenCookieName, data.mfa_token, {
                  maxAge: secondsIn10Minutes,
                  expires: new Date(epochIn10Minutes),
                })
                .redirect("/login/mfa");
            } else {
              const secondsIn5Minutes = 60 * 5;
              const epochIn5Minutes = Date.now() + secondsIn5Minutes * 1_000;
              const secondsIn1Day = 60 * 60 * 24;
              const epochIn1Day = Date.now() + secondsIn1Day * 1_000;
              const payload = await response.json();
              const data = payload as {
                access_token: string;
                refresh_token: string;
              };

              reply
                .setCookie(accessTokenCookieName, data.access_token, {
                  maxAge: secondsIn5Minutes,
                  expires: new Date(epochIn5Minutes),
                })
                .setCookie(refreshTokenCookieName, data.refresh_token, {
                  maxAge: secondsIn1Day,
                  expires: new Date(epochIn1Day),
                })
                .redirect("/");
            }
          } catch (err) {
            return reply.send(err);
          }
        },
      );
    },
    { prefix: "/google" },
  );
};

export default google;
