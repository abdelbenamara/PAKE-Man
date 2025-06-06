/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   csrf-protection.ts                                 :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: abenamar <abenamar@student.42.fr>          +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2025/05/15 12:43:45 by abenamar          #+#    #+#             */
/*   Updated: 2025/06/06 19:15:40 by abenamar         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

import FastifyCsrfProtectionPlugin, {
  FastifyCsrfProtectionOptions,
} from "@fastify/csrf-protection";
import fp from "fastify-plugin";

export namespace csrf {
  export const cookieName = "x__Host-crsf-token";
}

export default fp(
  async (scope) => {
    scope.register(FastifyCsrfProtectionPlugin, {
      cookieKey: csrf.cookieName,
      cookieOpts: {
        signed: true,
      },
      csrfOpts: {
        hmacKey: process.env.PAKE_MAN_CSRF_PROTECTION_HMAC_KEY!,
      },
      getUserInfo: (req) => {
        return req.user ? req.user.name : undefined;
      },
      getToken: (req) => {
        return req.headers["x-crsf-token"];
      },
      sessionPlugin: "@fastify/cookie",
    } as FastifyCsrfProtectionOptions);
  },
  { name: "csrf-protection", dependencies: ["cookie"] }
);
