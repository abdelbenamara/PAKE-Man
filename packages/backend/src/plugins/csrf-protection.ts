/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   csrf-protection.ts                                 :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: abenamar <abenamar@student.42.fr>          +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2025/05/15 12:43:45 by abenamar          #+#    #+#             */
/*   Updated: 2025/07/06 23:50:07 by abenamar         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

import FastifyCsrfProtectionPlugin, {
  FastifyCsrfProtectionOptions,
} from "@fastify/csrf-protection";
import fp from "fastify-plugin";

export namespace csrf {
  export const cookieName = "__Host-csrf-protection";
  export const headerName = "x-csrf-token";
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
        return req.user!.public_id;
      },
      getToken: (req) => {
        return req.headers[csrf.headerName];
      },
      sessionPlugin: "@fastify/cookie",
    } as FastifyCsrfProtectionOptions);
  },
  { name: "csrf-protection", dependencies: ["cookie"] },
);
