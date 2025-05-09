/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   server.ts                                          :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: abenamar <abenamar@student.42.fr>          +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2025/03/11 15:51:41 by abenamar          #+#    #+#             */
/*   Updated: 2025/05/08 22:19:22 by abenamar         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

import FastifyVite from "@fastify/vite";
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

await server.register(FastifyVite, {
  root: resolve(import.meta.dirname, ".."),
  renderer,
});

server.get("/", (_req, reply) => {
  return reply.html();
});

await server.vite.ready();

server.listen(
  { host: process.env.HOST, port: parseInt(process.env.PORT!) },
  (err, address) => {
    if (err) {
      server.log.error(err);
      process.exit(1);
    }

    server.log.info(`Server listening at ${address}`);
  },
);
