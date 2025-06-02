/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   refresh.ts                                         :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: abenamar <abenamar@student.42.fr>          +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2025/05/29 16:22:19 by abenamar          #+#    #+#             */
/*   Updated: 2025/06/02 20:27:11 by abenamar         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

import { jwt } from "#plugins/jwt.js";
import { FastifyPluginAsync } from "fastify";

const refresh = (async (scope) => {
  scope.register(
    async (scope) => {
      scope.get(
        "",
        {
          onRequest: [scope.verifyRefreshToken, scope.csrfProtection],
          schema: {
            security: [{ csrfAuth: [] }],
            tags: ["auth"],
          },
        },
        async (req, reply) => {
          try {
            const payload: jwt.UserInfo = Object.assign(
              {},
              await scope.prisma.user.findUnique({
                where: {
                  name: req.user.name,
                },
              })
            );
            const accessToken = jwt.setAccessToken(scope, reply, payload);

            return reply.send({ accessToken });
          } catch (err) {
            return reply.send(err);
          }
        }
      );
    },
    { prefix: "/refresh" }
  );
}) as FastifyPluginAsync;

export default refresh;
