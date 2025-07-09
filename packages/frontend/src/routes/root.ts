/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   root.ts                                            :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: abenamar <abenamar@student.42.fr>          +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2025/07/05 14:20:51 by abenamar          #+#    #+#             */
/*   Updated: 2025/07/09 10:42:40 by abenamar         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

import { html } from "#plugins/html.js";
import { views } from "#utils/views.js";
import { FastifyPluginAsync } from "fastify";
import { includeFile } from "ghtml/includeFile.js";
import { resolve } from "node:path";

const root: FastifyPluginAsync = async (scope) => {
  scope.register(
    async (scope) => {
      scope.addLayout(
        (inner, reply) => {
          const view = includeFile(resolve(views.path, "index.html")).split(
            html.layoutSeparator,
          );

          return scope.html`
            <main !${reply.htmxHeaders} !${views.mainClass}>
              !${view[0]}
                !${inner}
              !${view[1]}
            </main>
          `;
        },
        { skipOnHeader: "hx-request" },
      );
      scope.get(
        "",
        {
          onRequest: [scope.htmxHeadersFromAuthCookie],
        },
        async (_req, reply) => {
          return reply.html`!${views.homeHtml}`;
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

export default root;
