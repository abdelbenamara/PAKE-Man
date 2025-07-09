/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   pages.ts                                           :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: abenamar <abenamar@student.42.fr>          +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2025/07/05 14:20:51 by abenamar          #+#    #+#             */
/*   Updated: 2025/07/09 01:39:24 by abenamar         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

import { html } from "#plugins/html.js";
import { views } from "#utils/views.js";
import { FastifyPluginAsync } from "fastify";
import { includeFile } from "ghtml/includeFile.js";
import { resolve } from "node:path";

const pages: FastifyPluginAsync = async (scope) => {
  scope.register(
    async (scope) => {
      scope.addLayout(
        (inner, reply) => {
          const view = includeFile(resolve(views.path, "index.html")).split(
            html.layoutSeparator,
          );

          return scope.html`
            <body !${reply.htmxHeaders} class="bg-gray-100 m-0 p-0 flex flex-col min-h-screen">
              !${view[0]}
                !${inner}
              !${view[1]}
            </body>`;
        },
        { skipOnHeader: "hx-request" },
      );
      scope.get(
        "",
        {
          onRequest: [scope.htmxHeadersFromAuthCookie],
        },
        async (_req, reply) => {
          return reply.html`<div hx-post="/home" hx-target="#content" hx-trigger="load" class="hidden"></div>`;
        },
      );

      const routes = ["pong", "tournaments"];

      for (const route of routes) {
        scope.get(
          `${route}`,
          {
            onRequest: [scope.htmxHeadersFromAuthCookie],
          },
          (_req, reply) => {
            const view = includeFile(resolve(views.path, `${route}.html`));

            return reply.html`!${view}`;
          },
        );
      }
    },
    { prefix: "/" },
  );
};

export default pages;
