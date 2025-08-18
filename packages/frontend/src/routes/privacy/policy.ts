/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   policy.ts                                          :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: abenamar <abenamar@student.42.fr>          +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2025/08/17 18:46:25 by abenamar          #+#    #+#             */
/*   Updated: 2025/08/17 23:46:29 by abenamar         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

import { directoryPath, indexLayout, routeHandler } from "#utils/views.js";
import { FastifyPluginAsync } from "fastify";
import { resolve } from "node:path";

const privacy: FastifyPluginAsync = async (scope) => {
  scope.register(
    async (scope) => {
      scope.addLayout(indexLayout(scope), {
        skipOnHeader: "hx-request",
      });

      const path = resolve(directoryPath, "privacy");

      scope.get(
        "/",
        { schema: { tags: ["policy"] } },
        routeHandler(path, "policy"),
      );
    },
    { prefix: "/policy" },
  );
};

export default privacy;
