/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   refresh.ts                                         :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: abenamar <abenamar@student.42.fr>          +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2025/05/29 16:22:19 by abenamar          #+#    #+#             */
/*   Updated: 2025/07/08 23:36:04 by abenamar         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

import { auth } from "#utils/auth.js";
import { FastifyPluginAsync } from "fastify";

const refresh = (async (scope) => {
  scope.register(
    async (scope) => {
      scope.post(
        "",
        {
          onRequest: [scope.authenticateRefreshJwt, scope.csrfProtection],
          schema: {
            security: [{ csrfAuth: [] }],
            tags: ["auth"],
            response: {
              ...auth.successfulResponseSchema,
              ...auth.unauthorizedResponseSchema,
              ...auth.internalServerErrorResponseSchema,
            },
          },
        },
        async (req, reply) => {
          try {
            await req.accessJwtVerify();

            const accessToken = req.headers.authorization!.split(" ")[1];

            return reply.send(auth.successful(req, reply, accessToken));
          } catch {
            try {
              req.user = await scope.prisma.user.findUnique({
                where: { public_id: req.user!.public_id },
              });

              const payload = await auth.verify(scope, req, reply);

              return reply.send(payload);
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
