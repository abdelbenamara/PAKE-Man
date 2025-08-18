/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   pages.ts                                           :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: abenamar <abenamar@student.42.fr>          +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2025/07/10 01:25:06 by abenamar          #+#    #+#             */
/*   Updated: 2025/08/18 02:54:00 by abenamar         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

import { directoryPath, indexLayout, routeHandler } from "#utils/views.js";
import { FastifyPluginAsync } from "fastify";

const pages: FastifyPluginAsync = async (scope) => {
  const home = "home";

  scope
    .register(async (scope) => {
      scope.addLayout(indexLayout(scope));
      scope.get(
        "/",
        { schema: { tags: ["pages"] } },
        routeHandler(directoryPath, home),
      );
    })
    .register(async (scope) => {
      scope.addLayout(indexLayout(scope), {
        skipOnHeader: "hx-request",
      });

      for (const route of ["404", "pong", "tournaments", "unauthorized"]) {
        scope.get(
          `/${route}`,
          { schema: { tags: ["pages"] } },
          routeHandler(directoryPath, route),
        );
      }

      scope.post(
        "/",
        { schema: { tags: ["pages"] } },
        routeHandler(directoryPath, home),
      );
    });
};

export default pages;
