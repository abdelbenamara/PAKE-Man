/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   home.ts                                            :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: abenamar <abenamar@student.42.fr>          +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2025/07/09 00:03:15 by abenamar          #+#    #+#             */
/*   Updated: 2025/07/09 10:39:28 by abenamar         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

import { html } from "#plugins/html.js";
import { views } from "#utils/views.js";
import { FastifyPluginAsync } from "fastify";
import { includeFile } from "ghtml/includeFile.js";
import { resolve } from "node:path";

const home: FastifyPluginAsync = async (scope) => {
  const route = "home";

  scope.register(
    async (scope) => {
      scope
        .post("", async (req, reply) => {
          const view = includeFile(resolve(views.path, `${route}.html`));
          const hxCurrentUrl = req.headers["hx-current-url"] as string;

          if (hxCurrentUrl && hxCurrentUrl.endsWith("/home")) {
            reply.header("HX-Replace-Url", "/");
          }

          return reply.html`!${view}`;
        })
        .get("", async (_req, reply) => {
          const view = includeFile(resolve(views.path, "index.html")).split(
            html.layoutSeparator,
          );

          return reply.html`
            <main !${views.mainClass}>
              !${view[0]}
                !${views.homeHtml}
              !${view[1]}
            </main>
          `;
        });
    },
    { prefix: `/${route}` },
  );
};

export default home;
