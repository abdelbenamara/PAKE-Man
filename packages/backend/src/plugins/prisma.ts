/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   prisma.ts                                          :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: abenamar <abenamar@student.42.fr>          +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2025/05/24 14:42:02 by abenamar          #+#    #+#             */
/*   Updated: 2025/06/02 20:29:05 by abenamar         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

import { PrismaClient } from "#generated/prisma";
import FastifyPrismaPlugin from "@joggr/fastify-prisma";
import { PrismaBetterSQLite3 } from "@prisma/adapter-better-sqlite3";
import fp from "fastify-plugin";

export default fp(
  async (scope) => {
    const url = process.env.PAKE_MAN_PRISMA_DATABASE_URL!;
    const adapter = new PrismaBetterSQLite3({ url });
    const client = new PrismaClient({ adapter });

    await scope.register(FastifyPrismaPlugin, { client });
  },
  { name: "prisma" }
);

declare module "fastify" {
  interface FastifyInstance {
    prisma: PrismaClient;
  }
}
