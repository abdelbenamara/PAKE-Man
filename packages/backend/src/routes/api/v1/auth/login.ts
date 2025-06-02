/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   login.ts                                           :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: abenamar <abenamar@student.42.fr>          +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2025/05/29 12:30:58 by abenamar          #+#    #+#             */
/*   Updated: 2025/06/02 20:26:38 by abenamar         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

import { FastifyPluginAsync } from "fastify";

const login = (async (scope) => {
  scope.register(
    async (scope) => {
      scope.get(
        "",
        {
          schema: {
            security: [{ bearerAuth: [], csrfAuth: [] }],
            tags: ["auth"],
            querystring: {
              type: "object",
              properties: {
                provider: {
                  type: "string",
                },
              },
            },
          },
        },
        async (req, reply) => {
          const { provider } = req.query as { provider?: string };

          try {
            if (!req.headers.authorization) {
              req.headers.authorization = "Bearer <missing>";
            }

            await req.jwtVerify();
            scope.csrfProtection(req, reply, () => {});

            const csrfToken = reply.generateCsrf({ userInfo: req.user.name });

            return reply.send({ csrfToken });
          } catch (err) {
            switch (provider) {
              case "google":
                return reply.redirect("/api/v1/auth/google");
              default:
                break;
            }

            return reply.send(err);
          }
        }
      );
    },
    { prefix: "/login" }
  );
}) as FastifyPluginAsync;

export default login;
