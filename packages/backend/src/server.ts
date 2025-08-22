/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   server.ts                                          :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: abenamar <abenamar@student.42.fr>          +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2025/05/10 17:14:23 by abenamar          #+#    #+#             */
/*   Updated: 2025/08/18 17:29:11 by abenamar         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

import FastifyAutoLoadPlugin, {
  AutoloadPluginOptions as FastifyAutoloadPluginOptions,
} from "@fastify/autoload";
import FastifyHelmetPlugin, { FastifyHelmetOptions } from "@fastify/helmet";
import FastifyRoutesStatsPlugin, {
  FastifyRoutesStatsOptions,
} from "@fastify/routes-stats";
import CloseWithGrace from "close-with-grace";
import "dotenv/config";
import Fastify from "fastify";
import { resolve } from "node:path";
import "pino-socket";

const server = Fastify({
  logger: {
    level: "info",
    transport: {
      target: "pino-socket",
      options: {
        address: "logstash",
        port: 5044,
        mode: "tcp",
      },
    },
    formatters: {
      bindings: (bindings) => {
        return {
          pid: bindings.pid,
          hostname: bindings.hostname,
          node_version: process.version,
          application_name: "@pake-man/backend",
        };
      },
      level: (label) => {
        return { level: label.toLocaleUpperCase() };
      },
    },
  },
})
  .register(FastifyAutoLoadPlugin, {
    dir: resolve(import.meta.dirname, "plugins"),
  } as FastifyAutoloadPluginOptions)
  .register(async (scope) => {
    scope
      .register(FastifyHelmetPlugin, {
        global: true,
      } as FastifyHelmetOptions)
      .register(FastifyRoutesStatsPlugin, {
        printInterval: 60_000,
      } as FastifyRoutesStatsOptions)
      .register(FastifyAutoLoadPlugin, {
        dir: resolve(import.meta.dirname, "routes"),
      } as FastifyAutoloadPluginOptions);
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
  }
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
