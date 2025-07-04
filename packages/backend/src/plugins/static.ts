/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   static.ts                                          :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: abenamar <abenamar@student.42.fr>          +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2025/05/14 23:09:45 by abenamar          #+#    #+#             */
/*   Updated: 2025/05/31 10:40:17 by abenamar         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

import FastifyStaticPlugin, {
  SendOptions as FastifySendOptions,
  FastifyStaticOptions,
} from "@fastify/static";
import fp from "fastify-plugin";
import { resolve } from "node:path";

export default fp(
  async (scope) => {
    await scope.register(FastifyStaticPlugin, {
      root: resolve(import.meta.dirname, ".."),
      maxAge: "30d",
      immutable: true,
    } as FastifyStaticOptions);

    scope.get(
      "/favicon.ico",
      {
        helmet: {
          crossOriginResourcePolicy: false,
        },
      },
      async (_req, reply) => {
        return reply.sendFile("favicon.ico", {
          maxAge: "1d",
          immutable: false,
        } as FastifySendOptions);
      },
    );
  },
  { name: "static", dependencies: ["etag"] },
);
