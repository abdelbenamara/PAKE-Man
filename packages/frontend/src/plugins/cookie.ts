/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   cookie.ts                                          :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: abenamar <abenamar@student.42.fr>          +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2025/07/06 20:27:19 by abenamar          #+#    #+#             */
/*   Updated: 2025/07/08 11:42:54 by abenamar         ###   ########.fr       */
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
        path: "/",
        sameSite: "strict",
        secure: true,
        signed: true,
      },
    } as FastifyCookieOptions);
  },
  { name: "cookie", dependencies: ["cors"] },
);
