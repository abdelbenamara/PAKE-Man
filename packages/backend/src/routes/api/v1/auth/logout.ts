/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   logout.ts                                          :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: abenamar <abenamar@student.42.fr>          +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2025/05/31 15:44:25 by abenamar          #+#    #+#             */
/*   Updated: 2025/07/04 01:16:54 by abenamar         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

import { csrf } from "#plugins/csrf-protection.js";
import { jwt } from "#plugins/jwt.js";
import { auth } from "#utils/auth.js";
import { FastifyPluginAsync } from "fastify";

const logout = (async (scope) => {
  scope.register(
    async (scope) => {
      scope.get(
        "",
        {
          onRequest: [scope.authenticateAccessJwt, scope.csrfProtection],
          schema: {
            security: [{ bearerAuth: [], csrfAuth: [] }],
            tags: ["auth"],
            response: {
              200: {
                description: "Successful response",
                content: {
                  "application/json": {
                    schema: {
                      example: {
                        message: "Player#1 successfully logged out.",
                      },
                      type: "object",
                      properties: {
                        message: { type: "string" },
                      },
                    },
                  },
                },
              },
              ...auth.unauthorizedResponseSchema,
              ...auth.internalServerErrorResponseSchema,
            },
          },
        },
        async (req, reply) => {
          try {
            const user = await scope.prisma.user.findUnique({
              where: { public_id: req.user!.public_id },
              select: {
                name: true,
              },
            });

            return reply
              .clearCookie(csrf.cookieName)
              .clearCookie(jwt.cookieName)
              .send({ message: user!.name + " successfully logged out." });
          } catch (err) {
            return reply.send(err);
          }
        },
      );
    },
    { prefix: "/logout" },
  );
}) as FastifyPluginAsync;

export default logout;
