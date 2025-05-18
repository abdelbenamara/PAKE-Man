/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   server.ts                                          :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: abenamar <abenamar@student.42.fr>          +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2025/03/11 15:51:41 by abenamar          #+#    #+#             */
/*   Updated: 2025/05/18 16:35:22 by abenamar         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

import FastifyVite from "@fastify/vite";
import CloseWithGrace from "close-with-grace";
import "dotenv/config";
import Fastify from "fastify";
import { resolve } from "node:path";
import renderer from "./server/renderer.js";

const server = Fastify({
  logger: {
    level: "debug",
    transport: {
      targets: [
        {
          level: "info",
          target: "@fastify/one-line-logger",
        },
        {
          level: "error",
          target: "@fastify/one-line-logger",
          options: { destination: process.stderr.fd },
        },
      ],
      dedupe: true,
    },
  },
});

CloseWithGrace(
  {
    delay: parseInt(process.env.SERVER_CLOSE_GRACE_DELAY!),
    logger: server.log,
  },
  async ({ err, signal }) => {
    if (err) {
      server.log.error({ err }, "server closing with error");
    } else {
      server.log.warn(`${signal} received, server closing`);
    }

    await server.close();
  },
);

try {
  await server.register(FastifyVite, {
    root: resolve(import.meta.dirname, ".."),
    renderer,
  });

  server.get("/", (_req, reply) => {
    return reply.html();
  });

  await server.vite.ready();
  await server.listen({
    host: process.env.SERVER_HOST,
    port: parseInt(process.env.SERVER_PORT!),
  });

  server.log.info(`Server plugins: \n${server.printPlugins()}`);
  server.log.info(`Server routes: \n${server.printRoutes()}`);
} catch (err) {
  server.log.error(err);
  process.exit(1);
}
