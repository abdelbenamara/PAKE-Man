/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   home.ts                                            :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: abenamar <abenamar@student.42.fr>          +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2025/07/09 00:03:15 by abenamar          #+#    #+#             */
/*   Updated: 2025/07/09 01:22:30 by abenamar         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

import { views } from "#utils/views.js";
import { FastifyPluginAsync } from "fastify";
import { includeFile } from "ghtml/includeFile.js";
import { resolve } from "node:path";

const home: FastifyPluginAsync = async (scope) => {
  const route = "home";

  scope.register(
    async (scope) => {
      scope.post("", {}, async (_req, reply) => {
        const view = includeFile(resolve(views.path, `${route}.html`));

        return reply.html`!${view}`;
      });
    },
    { prefix: `/${route}` },
  );
};

export default home;
