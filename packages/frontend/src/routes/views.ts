/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   root.ts                                            :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: abenamar <abenamar@student.42.fr>          +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2025/07/05 14:20:51 by abenamar          #+#    #+#             */
/*   Updated: 2025/07/05 21:19:36 by abenamar         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

import { FastifyPluginAsync } from "fastify";
import { includeFile } from "ghtml/includeFile.js";
import { resolve } from "node:path";

const root: FastifyPluginAsync = async (scope) => {
  scope.register(
    async (scope) => {
      scope.get("", (_req, reply) => {
        const view = includeFile(
          resolve(import.meta.dirname, "..", "views", "index.html"),
        );

        return reply.html`!${view}`;
      });

      const views = ["pong", "profile", "tournaments"];

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
