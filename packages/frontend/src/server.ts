/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   server.ts                                          :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: abenamar <abenamar@student.42.fr>          +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2025/03/11 15:51:41 by abenamar          #+#    #+#             */
/*   Updated: 2025/08/18 02:53:45 by abenamar         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

import FastifyAutoLoadPlugin, {
  AutoloadPluginOptions as FastifyAutoloadPluginOptions,
} from "@fastify/autoload";
import CloseWithGrace from "close-with-grace";
import "dotenv/config";
import Fastify from "fastify";
import { resolve } from "node:path";

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
})
  .register(FastifyAutoLoadPlugin, {
    dir: resolve(import.meta.dirname, "plugins"),
  } as FastifyAutoloadPluginOptions)
  .register(FastifyAutoLoadPlugin, {
    dir: resolve(import.meta.dirname, "routes"),
  } as FastifyAutoloadPluginOptions)
  .setNotFoundHandler((_req, reply) => {
    reply.redirect("/404");
  })
  .setErrorHandler((err, _req, reply) => {
    if (err.statusCode === 401 || err.statusCode === 403) {
      return reply.redirect("/unauthorized");
    }
  });

CloseWithGrace(
  {
    delay: parseInt(process.env.PAKE_MAN_SERVER_CLOSE_GRACE_DELAY!),
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
  await server.listen({
    host: process.env.PAKE_MAN_SERVER_HOST!,
    port: parseInt(process.env.PAKE_MAN_SERVER_PORT!),
  });

  server.log.info(`Server plugins: \n${server.printPlugins()}`);
  server.log.info(`Server routes: \n${server.printRoutes()}`);
} catch (err) {
  server.log.error(err);
  process.exit(1);
}
