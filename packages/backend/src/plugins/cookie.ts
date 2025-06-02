/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   cookie.ts                                          :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: abenamar <abenamar@student.42.fr>          +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2025/05/14 14:37:41 by abenamar          #+#    #+#             */
/*   Updated: 2025/06/01 18:51:07 by abenamar         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

import FastifyCookiePlugin, { FastifyCookieOptions } from "@fastify/cookie";
import fp from "fastify-plugin";

export default fp(
  async (scope) => {
    scope.register(FastifyCookiePlugin, {
      secret: process.env.PAKE_MAN_COOKIE_SECRET!,
      hook: "onRequest",
      algorithm: "sha256",
      parseOptions: {
        domain: undefined,
        httpOnly: true,
        partitioned: true,
        path: "/",
        sameSite: "strict",
        secure: true,
        signed: true,
      },
    } as FastifyCookieOptions);
  },
  { name: "cookie", dependencies: ["cors"] },
);
