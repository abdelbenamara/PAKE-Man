/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   users.ts                                           :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: abenamar <abenamar@student.42.fr>          +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2025/05/27 19:57:51 by abenamar          #+#    #+#             */
/*   Updated: 2025/06/02 20:27:38 by abenamar         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

import { FastifyPluginAsync } from "fastify";

const users = (async (scope) => {
  scope.register(
    async (scope) => {
      scope.get(
        "",
        {
          onRequest: [scope.verifyAccessToken, scope.csrfProtection],
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
                          picture: "https://example.com/picture1",
                          name: "Player#1",
                        },
                        {
                          picture: "https://example.com/picture2",
                          name: "Player#2",
                        },
                      ],
                      type: "array",
                      items: {
                        type: "object",
                        properties: {
                          picture: {
                            type: "string",
                            format: "uri",
                          },
                          name: {
                            type: "string",
                          },
                        },
                      },
                    },
                  },
                },
              },
            },
            tags: ["users"],
          },
        },
        async (_req, reply) => {
          try {
            const users = await scope.prisma.user.findMany({
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
      );
    },
    { prefix: "/users" }
  );
}) as FastifyPluginAsync;

export default users;
