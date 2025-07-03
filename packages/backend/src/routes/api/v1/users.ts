/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   users.ts                                           :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: abenamar <abenamar@student.42.fr>          +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2025/05/27 19:57:51 by abenamar          #+#    #+#             */
/*   Updated: 2025/07/04 01:18:36 by abenamar         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

import { auth } from "#utils/auth.js";
import { FastifyPluginAsync } from "fastify";

const users = (async (scope) => {
  scope.register(
    async (scope) => {
      scope
        .get(
          "",
          {
            onRequest: [scope.authenticateAccessJwt, scope.csrfProtection],
            schema: {
              security: [{ bearerAuth: [], csrfAuth: [] }],
              response: {
                200: {
                  description: "Successful response",
                  content: {
                    "application/json": {
                      schema: {
                        example: [
                          {
                            name: "Player#2",
                            picture: "https://example.com/picture2",
                          },
                          {
                            name: "Player#3",
                            picture: "https://example.com/picture3",
                          },
                        ],
                        type: "array",
                        items: {
                          type: "object",
                          properties: {
                            name: { type: "string" },
                            picture: { type: "string", format: "uri" },
                          },
                        },
                      },
                    },
                  },
                },
                ...auth.unauthorizedResponseSchema,
              },
              tags: ["users"],
            },
          },
          async (req, reply) => {
            try {
              const users = await scope.prisma.user.findMany({
                where: {
                  public_id: {
                    not: req.user!.public_id,
                  },
                },
                select: {
                  picture: true,
                  name: true,
                },
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
            onRequest: [scope.authenticateAccessJwt, scope.csrfProtection],
            schema: {
              security: [{ bearerAuth: [], csrfAuth: [] }],
              response: {
                200: {
                  description: "Successful response",
                  content: {
                    "application/json": {
                      schema: {
                        example: {
                          email: "john.doe@example.com",
                          name: "Player#1",
                          picture: "https://example.com/picture",
                          hotp_enabled: true,
                          created_at: "1970-01-01T00:00:00Z",
                        },
                        type: "object",
                        properties: {
                          email: { type: "string", format: "email" },
                          name: { type: "string" },
                          picture: { type: "string", format: "uri" },
                          hotp_enabled: { type: "boolean" },
                          created_at: { type: "string", format: "date-time" },
                        },
                      },
                    },
                  },
                },
                ...auth.unauthorizedResponseSchema,
              },
              tags: ["users"],
            },
          },
          async (req, reply) => {
            try {
              const user = await scope.prisma.user.findUniqueOrThrow({
                where: {
                  public_id: req.user!.public_id,
                },
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
        );
    },
    { prefix: "/users" }
  );
}) as FastifyPluginAsync;

export default users;
