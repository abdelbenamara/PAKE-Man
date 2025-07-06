/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   login.ts                                           :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: abenamar <abenamar@student.42.fr>          +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2025/05/29 12:30:58 by abenamar          #+#    #+#             */
/*   Updated: 2025/07/06 16:17:51 by abenamar         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

import { FastifyPluginAsync } from "fastify";

const login = (async (scope) => {
  scope.register(
    async (scope) => {
      scope.get<{ Querystring: { provider: string } }>(
        "",
        {
          schema: {
            tags: ["auth"],
            querystring: {
              type: "object",
              properties: {
                provider: {
                  type: "string",
                },
              },
              required: ["provider"],
            },
            response: {
              302: {
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
          const { provider } = req.query;

          switch (provider) {
            case "google":
              return reply.redirect("/api/v1/auth/google", 302);

            default:
              return reply.badRequest().send({
                error: "Invalid provider",
              });
          }
        },
      );
    },
    { prefix: "/login" },
  );
}) as FastifyPluginAsync;

export default login;
