/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   refresh.ts                                         :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: abenamar <abenamar@student.42.fr>          +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2025/05/29 16:22:19 by abenamar          #+#    #+#             */
/*   Updated: 2025/07/07 00:48:15 by abenamar         ###   ########.fr       */
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
