/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   users.ts                                           :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: abenamar <abenamar@student.42.fr>          +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2025/05/27 19:57:51 by abenamar          #+#    #+#             */
/*   Updated: 2025/08/18 01:10:55 by abenamar         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

import { FastifyPluginAsync } from "fastify";

const users: FastifyPluginAsync = async (scope) => {
  scope.register(
    async (scope) => {
      scope
        .get(
          "",
          {
            onRequest: [scope.authenticateAccessJwt],
            schema: { security: [{ bearerAuth: [] }], tags: ["users"] },
          },
          async (req, reply) => {
            try {
              const users = await scope.prisma.user.findMany({
                where: { public_id: { not: req.user!.public_id } },
                select: { picture: true, name: true },
              });

              return reply.send(users);
            } catch (err) {
              return reply.send(err);
            }
          }
        )
        .get(
          "/me",
          {
            onRequest: [scope.authenticateAccessJwt],
            schema: { security: [{ bearerAuth: [] }], tags: ["users"] },
          },
          async (req, reply) => {
            try {
              const user = await scope.prisma.user.findUniqueOrThrow({
                where: { public_id: req.user!.public_id },
                select: {
                  email: true,
                  name: true,
                  picture: true,
                  hotp_enabled: true,
                  created_at: true,
                },
              });

              return reply.send(user);
            } catch (err) {
              return reply.send(err);
            }
          }
        )
        .delete(
          "/me",
          {
            onRequest: [scope.authenticateAccessJwt],
            schema: { security: [{ bearerAuth: [] }], tags: ["users"] },
          },
          async (req, reply) => {
            try {
              await scope.prisma.user.delete({
                where: { public_id: req.user!.public_id },
              });

              return reply.code(204).send();
            } catch (err) {
              return reply.send(err);
            }
          }
        );
    },
    { prefix: "/users" }
  );
};

export default users;
