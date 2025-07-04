/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   refresh.ts                                         :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: abenamar <abenamar@student.42.fr>          +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2025/05/29 16:22:19 by abenamar          #+#    #+#             */
/*   Updated: 2025/07/04 01:17:15 by abenamar         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

import { auth } from "#utils/auth.js";
import { FastifyPluginAsync } from "fastify";

const refresh = (async (scope) => {
  scope.register(
    async (scope) => {
      scope.get(
        "",
        {
          onRequest: [scope.authenticateRefreshJwt, scope.csrfProtection],
          schema: {
            security: [{ bearerAuth: [], csrfAuth: [] }],
            tags: ["auth"],
            response: {
              ...auth.successfulResponseSchema,
              ...auth.unauthorizedResponseSchema,
            },
          },
        },
        async (req, reply) => {
          try {
            await req.accessJwtVerify();

            const accessToken = req.headers.authorization!.split(" ")[1];

            return auth.successful(scope, req, reply, accessToken);
          } catch {
            try {
              req.user = await scope.prisma.user.findUnique({
                where: {
                  public_id: req.user!.public_id,
                },
              });

              return auth.verify(scope, req, reply);
            } catch (err) {
              return reply.send(err);
            }
          }
        },
      );
    },
    { prefix: "/refresh" },
  );
}) as FastifyPluginAsync;

export default refresh;
