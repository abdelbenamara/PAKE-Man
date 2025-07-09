/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   user.ts                                            :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: abenamar <abenamar@student.42.fr>          +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2025/07/06 21:27:02 by abenamar          #+#    #+#             */
/*   Updated: 2025/07/09 02:17:41 by abenamar         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

import { html } from "#plugins/html.js";
import { api } from "#utils/api.js";
import { views } from "#utils/views.js";
import { FastifyPluginAsync } from "fastify";
import { includeFile } from "ghtml/includeFile.js";
import { resolve } from "node:path";

const user: FastifyPluginAsync = async (scope) => {
  const route = "user";

  scope.register(
    async (scope) => {
      const menu = "menu";
      const profile = "profile";
      const path = resolve(views.path, `${route}`);

      scope
        .post(`/${menu}`, async (req, reply) => {
          const response = await api.get("/api/v1/users/me", req.headers);

          if (!response.ok) {
            return reply.unauthorized();
          }

          const view = includeFile(resolve(path, `${menu}.html`)).split(
            html.layoutSeparator,
          );
          const payload = await response.json();
          const { picture } = payload as { picture: string };

          return reply.html`!${view[0]}<img src="${picture}" alt="Profile Picture" class="w-8 h-8 rounded-full" />!${view[1]}`;
        })
        .get(`/${profile}`, async (req, reply) => {
          const response = await api.get("/api/v1/users/me", req.headers);

          if (!response.ok) {
            return reply.redirect("/");
          }

          const view = includeFile(resolve(path, `${profile}.html`)).split(
            html.layoutSeparator,
          );

          return reply.html`!${view}`;
        });
    },
    { prefix: `/${route}` },
  );
};

export default user;
