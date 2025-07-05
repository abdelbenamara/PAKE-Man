/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   static.ts                                          :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: abenamar <abenamar@student.42.fr>          +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2025/07/05 14:16:52 by abenamar          #+#    #+#             */
/*   Updated: 2025/07/05 14:22:46 by abenamar         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

import FastifyStaticPlugin, { FastifyStaticOptions } from "@fastify/static";
import fp from "fastify-plugin";
import { resolve } from "node:path";

export default fp(
  async (scope) => {
    await scope.register(FastifyStaticPlugin, {
      root: resolve(import.meta.dirname, "..", "client"),
      index: false,
      wildcard: false,
      allowedPath: (pathName) => {
        return pathName !== "/index.html";
      },
    } as FastifyStaticOptions);
  },
  { name: "static", dependencies: ["etag"] },
);
