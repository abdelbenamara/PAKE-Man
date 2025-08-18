/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   mfa.ts                                             :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: abenamar <abenamar@student.42.fr>          +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2025/08/18 02:05:53 by abenamar          #+#    #+#             */
/*   Updated: 2025/08/18 02:34:43 by abenamar         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

import {
  accessTokenCookieName,
  mfaTokenCookieName,
  refreshTokenCookieName,
} from "#utils/api.js";
import {
  directoryPath,
  indexLayout,
  routeHandler,
  unauthorized,
} from "#utils/views.js";
import { FastifyPluginAsync } from "fastify";
import { resolve } from "node:path";

const mfa: FastifyPluginAsync = async (scope) => {
  scope.register(
    async (scope) => {
      scope.addLayout(indexLayout(scope), {
        skipOnHeader: "hx-request",
      });

      const path = resolve(directoryPath, "login");

      scope
        .get("", { schema: { tags: ["mfa"] } }, routeHandler(path, "mfa"))
        .post<{
          Body: { code: string };
        }>("", { schema: { tags: ["mfa"] } }, async (req, reply) => {
          const response = await fetch(
            process.env.PAKE_MAN_BACKEND_URL! + "/api/v1/auth/hotp",
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                token: req.unsignCookie(req.cookies[mfaTokenCookieName]!).value,
                code: req.body.code,
              }),
            },
          );

          if (!response.ok) {
            return unauthorized(req, reply);
          }

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
            .code(204)
            .clearCookie(mfaTokenCookieName)
            .setCookie(accessTokenCookieName, data.access_token, {
              maxAge: secondsIn5Minutes,
              expires: new Date(epochIn5Minutes),
            })
            .setCookie(refreshTokenCookieName, data.refresh_token, {
              maxAge: secondsIn1Day,
              expires: new Date(epochIn1Day),
            })
            .header("HX-Location", "/")
            .send();
        });
    },
    { prefix: "/mfa" },
  );
};

export default mfa;
