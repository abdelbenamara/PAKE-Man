/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   user.ts                                            :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: abenamar <abenamar@student.42.fr>          +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2025/07/06 21:27:02 by abenamar          #+#    #+#             */
/*   Updated: 2025/08/18 01:32:46 by abenamar         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

import {
  accessTokenCookieName,
  get,
  refreshTokenCookieName,
  request,
} from "#utils/api.js";
import { directoryPath, layoutSeparator, unauthorized } from "#utils/views.js";
import { FastifyPluginAsync, FastifyReply, FastifyRequest } from "fastify";
import { includeFile } from "ghtml/includeFile.js";
import { resolve } from "node:path";

const user: FastifyPluginAsync = async (scope) => {
  const route = "user";

  scope
    .decorateRequest("user", null)
    .addHook("onRequest", scope.csrfProtection)
    .addHook("onRequest", async (req: FastifyRequest) => {
      if (
        accessTokenCookieName in req.cookies &&
        req.unsignCookie(req.cookies[accessTokenCookieName]!).valid
      ) {
        const response = await get("/api/v1/users/me", req);

        if (response.ok) {
          const payload = await response.json();
          req.user = payload as FastifyRequest["user"];
        }
      }
    })
    .register(
      async (scope) => {
        const path = resolve(directoryPath, route);

        scope
          .post("/menu", { schema: { tags: ["user"] } }, async (req, reply) => {
            if (!req.user) {
              return reply.code(204).send();
            }

            const view = includeFile(resolve(path, "menu.html")).split(
              layoutSeparator,
            );

            return reply.html`
              !${view[0]}
                <img src="${req.user!.picture}" alt="Profile Picture" class="w-8 h-8 rounded-full" />
              !${view[1]}
            `;
          })
          .get(
            "/profile",
            {
              onRequest: async (req: FastifyRequest, reply: FastifyReply) => {
                if (!req.user) {
                  return reply.code(204).header("HX-Location", "/").send();
                }
              },
              schema: { tags: ["user"] },
            },
            async (req, reply) => {
              const view = includeFile(resolve(path, "profile.html")).split(
                layoutSeparator,
              );

              return reply.html`
              !${view[0]}
                <img src="${req.user!.picture}" alt="Profile Picture" class="w-16 h-16 rounded-full" />
                <div class="m-0 flex flex-col items-end-safe p-0">
                  <h1 class="text-2xl font-bold">${req.user!.name}</h1>
                  <p class="text-sm text-gray-500">${req.user!.email}</p>
                </div>
              !${view[1]}
            `;
            },
          )
          .post("/mfa", { schema: { tags: ["user"] } }, async (req, reply) => {
            if (!req.user || !req.user.hotp_enabled) {
              return reply.code(204).send();
            }

            return reply.html`
              <button
                class="cursor-pointer rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 focus:ring-2 focus:ring-blue-400 focus:outline-none"
                hx-post="/email/mfa/disable"
                hx-swap="outerHTML"
              >
                Disable 2FA
              </button>
            `;
          })
          .delete("", { schema: { tags: ["user"] } }, async (req, reply) => {
            if (!req.user) {
              return reply.code(204).send();
            }

            const response = await request("/api/v1/users/me", "DELETE", req);

            if (!response.ok) {
              return unauthorized(req, reply);
            }

            return reply
              .code(204)
              .clearCookie(accessTokenCookieName)
              .clearCookie(refreshTokenCookieName)
              .header("HX-Location", "/")
              .send();
          });
      },
      { prefix: `/${route}` },
    );
};

export default user;

declare module "fastify" {
  interface FastifyRequest {
    user: {
      email: string;
      name: string;
      picture: string;
      hotp_enabled: boolean;
      created_at: string;
    } | null;
  }
}
