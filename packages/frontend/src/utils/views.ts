/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   views.ts                                           :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: abenamar <abenamar@student.42.fr>          +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2025/07/09 00:51:03 by abenamar          #+#    #+#             */
/*   Updated: 2025/08/18 02:54:17 by abenamar         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

import { csrfHeaderName } from "#plugins/csrf-protection.js";
import { post, refreshTokenCookieName } from "#utils/api.js";
import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { includeFile } from "ghtml/includeFile.js";
import { resolve } from "path";

export const cookieConsentCookieName = "__Host-cookie-consent";
export const layoutSeparator = "<!-- inner -->";
export const directoryPath = resolve(import.meta.dirname, "..", "views");
export const indexLayout = (scope: FastifyInstance) => {
  return (inner: string, reply: FastifyReply) => {
    const view = includeFile(resolve(directoryPath, "index.html")).split(
      layoutSeparator,
    );

    return scope.html`
        <body hx-headers='{"${csrfHeaderName}": "${reply.generateCsrf()}"}' class="m-0 flex min-h-dvh flex-col bg-gray-100 p-0">
          !${view[0]} !${inner} !${view[1]}
        </body>
      `;
  };
};
export const routeHandler = (path: string, name: string) => {
  return async (_req: FastifyRequest, reply: FastifyReply) => {
    const view = includeFile(resolve(path, `${name}.html`));

    return reply.html`!${view}`;
  };
};
export const unauthorized = routeHandler(directoryPath, "unauthorized");
export const notFound = routeHandler(directoryPath, "404");
export const authRefresh = async (req: FastifyRequest, reply: FastifyReply) => {
  const refreshToken = req.unsignCookie(
    req.cookies[refreshTokenCookieName] || "",
  );

  if (refreshToken.valid) {
    const response = await post("/api/v1/auth/refresh", req, {
      refresh_token: refreshToken.value,
    });

    if (response.ok) {
      const payload = await response.json();
      req.user = payload as FastifyRequest["user"];
      return reply.code(204).send();
    }
  }
};
