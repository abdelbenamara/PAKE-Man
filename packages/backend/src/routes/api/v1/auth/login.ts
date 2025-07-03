/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   login.ts                                           :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: abenamar <abenamar@student.42.fr>          +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2025/05/29 12:30:58 by abenamar          #+#    #+#             */
/*   Updated: 2025/07/04 01:14:28 by abenamar         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

import { FastifyPluginAsync } from "fastify";

const login = (async (scope) => {
  scope.register(
    async (scope) => {
      scope.post(
        "",
        {
          schema: {
            security: [{ bearerAuth: [], csrfAuth: [] }],
            tags: ["auth"],
            body: {
              type: "object",
              properties: {
                provider: {
                  type: "string",
                },
              },
              required: ["provider"],
            },
            response: {
              303: {
                description: "Redirect to the authentication provider",
              },
              400: {
                description: "Bad Request",
                content: {
                  "application/json": {
                    schema: {
                      type: "object",
                      properties: {
                        error: { type: "string" },
                      },
                    },
                  },
                },
              },
            },
          },
        },
        async (req, reply) => {
          const { provider } = req.body as { provider?: string };

          switch (provider) {
            case "google":
              return reply.redirect("/api/auth/google", 303);
            default:
              return reply.badRequest().send({
                error: "Invalid provider",
              });
          }
        }
      );
    },
    { prefix: "/login" }
  );
}) as FastifyPluginAsync;

export default login;
