/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   userinfo.ts                                        :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: abenamar <abenamar@student.42.fr>          +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2025/05/27 19:57:51 by abenamar          #+#    #+#             */
/*   Updated: 2025/06/02 20:27:25 by abenamar         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

import { FastifyPluginAsync } from "fastify";

const userinfo = (async (scope) => {
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
                      example: {
                        picture: "https://example.com/picture1",
                        email: "john.doe@example.com",
                        name: "Player#1",
                        created_at: "1970-01-01T12:34:56.789Z",
                      },
                      type: "object",
                      properties: {
                        picture: {
                          type: "string",
                          format: "uri",
                        },
                        email: {
                          type: "string",
                          format: "email",
                        },
                        name: {
                          type: "string",
                        },
                        created_at: {
                          type: "string",
                          format: "date-time",
                        },
                      },
                    },
                  },
                },
              },
            },
            tags: ["auth"],
          },
        },
        async (req, reply) => {
          return reply.send(req.user);
        },
      );
    },
    { prefix: "/userinfo" },
  );
}) as FastifyPluginAsync;

export default userinfo;
