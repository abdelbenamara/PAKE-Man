/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   server.ts                                          :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: abenamar <abenamar@student.42.fr>          +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2025/03/11 15:51:41 by abenamar          #+#    #+#             */
/*   Updated: 2025/05/21 10:47:48 by abenamar         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

import FastifyStatic, { FastifyStaticOptions } from "@fastify/static";
import CloseWithGrace from "close-with-grace";
import "dotenv/config";
import Fastify from "fastify";
import FastifyHtmlPlugin, { FastifyHtmlOptions } from "fastify-html";
import { includeFile } from "ghtml/includeFile.js";
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
  await server
    .register(FastifyStatic, {
      root: resolve(import.meta.dirname, "client"),
      index: false,
      wildcard: false,
      allowedPath: (pathName) => {
        return pathName !== "/index.html";
      },
    } as FastifyStaticOptions)
    .register(FastifyHtmlPlugin, {
      async: true,
    } as FastifyHtmlOptions);

  server.addLayout(
    (inner) => {
      const head = includeFile(
        resolve(import.meta.dirname, "client", "index.html"),
      )
        .split("<head>")[1]
        .split("</head>")[0];

      return server.html`
        <!doctype html>
        <html lang="en">
          <head>
            !${head}
          </head>
          <body class="m-0 h-screen w-screen p-0">
            !${inner}
          </body>
        </html>
      `;
    },
    { skipOnHeader: "hx-request" },
  );
  server.get("/", (_req, reply) => {
    const indexView = includeFile(
      resolve(import.meta.dirname, "views", "index.html"),
    );

    return reply.html`!${indexView}`;
  });

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
