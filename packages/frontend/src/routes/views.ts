/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   views.ts                                           :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: abenamar <abenamar@student.42.fr>          +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2025/07/05 14:20:51 by abenamar          #+#    #+#             */
/*   Updated: 2025/07/07 00:55:10 by abenamar         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

import { FastifyPluginAsync } from "fastify";
import { includeFile } from "ghtml/includeFile.js";
import { resolve } from "node:path";

const root: FastifyPluginAsync = async (scope) => {
  scope.register(
    async (scope) => {
      scope.get("", (req, reply) => {
        const view = includeFile(
          resolve(import.meta.dirname, "..", "views", "index.html"),
        );
        const authToken = req.cookies["__Host-auth-token"];
        let attributes = `class="m-0 flex h-screen w-screen flex-col bg-gray-100 p-0"`;

        if (authToken) {
          const paylaod = JSON.parse(authToken);
          attributes += ` hx-headers='{"Authorization": "Bearer ${paylaod.access_token}", "x-csrf-token": "${paylaod.csrf_token}"}'`;
        }

        return reply.html`<body hx-ext="preload" !${attributes}>!${view}</body>`;
      });

      const views = ["home", "pong", "profile", "tournaments"];

      for (const view of views) {
        scope.get(`${view}`, (_req, reply) => {
          const viewContent = includeFile(
            resolve(import.meta.dirname, "..", "views", `${view}.html`),
          );

          return reply.html`!${viewContent}`;
        });
      }
    },
    { prefix: "/" },
  );
};

export default root;
