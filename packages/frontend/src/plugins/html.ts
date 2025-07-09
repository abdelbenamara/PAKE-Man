/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   html.ts                                            :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: abenamar <abenamar@student.42.fr>          +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2025/07/05 14:18:11 by abenamar          #+#    #+#             */
/*   Updated: 2025/07/09 01:22:52 by abenamar         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

import { api } from "#utils/api.js";
import {
  FastifyReply,
  FastifyRequest,
  onRequestAsyncHookHandler,
} from "fastify";
import FastifyHtmlPlugin, { FastifyHtmlOptions } from "fastify-html";
import fp from "fastify-plugin";
import { includeFile } from "ghtml/includeFile.js";
import { resolve } from "node:path";

export namespace html {
  export const layoutSeparator = "<!-- inner -->";
}

export default fp(
  async (scope) => {
    await scope.register(FastifyHtmlPlugin, {
      async: true,
    } as FastifyHtmlOptions);

    scope
      .decorateReply("htmxHeaders", "")
      .decorate(
        "htmxHeadersFromAuthCookie",
        async (req: FastifyRequest, reply: FastifyReply) => {
          const rawAuthCookie = req.cookies[api.authCookieName];

          if (rawAuthCookie) {
            const authToken = req.unsignCookie(rawAuthCookie);

            if (authToken.valid) {
              const payload = JSON.parse(authToken.value);
              reply.htmxHeaders = `hx-headers='{"Authorization": "Bearer ${payload.access_token}", "x-csrf-token": "${payload.csrf_token}"}'`;
            }

            reply.clearCookie(api.authCookieName);
          }
        },
      )
      .addLayout(
        (inner) => {
          const view = includeFile(
            resolve(import.meta.dirname, "..", "client", "index.html"),
          ).split(html.layoutSeparator);

          return scope.html`!${view[0]}!${inner}!${view[1]}`;
        },
        { skipOnHeader: "hx-request" },
      );
  },
  { name: "helmet" },
);

declare module "fastify" {
  interface FastifyInstance {
    htmxHeadersFromAuthCookie: onRequestAsyncHookHandler;
  }

  interface FastifyReply {
    htmxHeaders: string;
  }
}
