/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   csrf-protection.ts                                 :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: abenamar <abenamar@student.42.fr>          +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2025/05/15 12:43:45 by abenamar          #+#    #+#             */
/*   Updated: 2025/08/18 01:21:52 by abenamar         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

import FastifyCsrfProtectionPlugin, {
  FastifyCsrfProtectionOptions,
} from "@fastify/csrf-protection";
import fp from "fastify-plugin";

export const csrfHeaderName = "x-csrf-token";

export default fp(
  async (scope) => {
    scope.register(FastifyCsrfProtectionPlugin, {
      cookieKey: "__Host-csrf-protection",
      cookieOpts: {
        signed: true,
      },
      csrfOpts: {
        hmacKey: process.env.PAKE_MAN_CSRF_PROTECTION_HMAC_KEY!,
      },
      getToken: (req) => {
        return req.headers[csrfHeaderName];
      },
      sessionPlugin: "@fastify/cookie",
    } as FastifyCsrfProtectionOptions);
  },
  { name: "csrf-protection", dependencies: ["cookie"] },
);
