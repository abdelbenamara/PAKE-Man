/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   hotp.ts                                            :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: abenamar <abenamar@student.42.fr>          +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2025/06/23 20:55:07 by abenamar          #+#    #+#             */
/*   Updated: 2025/07/09 03:06:59 by abenamar         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

import { jwt } from "#plugins/jwt.js";
import { auth } from "#utils/auth.js";
import { FastifyPluginAsync } from "fastify";

const hotp: FastifyPluginAsync = async (scope) => {
  scope.register(
    async (scope) => {
      scope.post(
        "/verification",
        {
          onRequest: [scope.authenticateQueryJwt, scope.csrfProtection],
          schema: {
            security: [{ csrfAuth: [] }],
            tags: ["hotp"],
            querystring: {
              type: "object",
              properties: {
                token: { type: "string" },
              },
            },
            body: {
              type: "object",
              properties: {
                code: { type: "string" },
              },
              required: ["code"],
            },
            response: {
              ...auth.successfulResponseSchema,
              ...auth.unauthorizedResponseSchema,
              ...auth.internalServerErrorResponseSchema,
            },
          },
        },
        async (req, reply) => {
          try {
            const { code } = req.body as { code: string };

            if (!req.hotpValidate({ token: code })) {
              return reply.unauthorized().send({ error: "Invalid HOTP code" });
            }

            const accessToken = await jwt.setAccessToken(reply, req.user!);

            return reply.send(auth.successful(req, reply, accessToken));
          } catch (err) {
            return reply.send(err);
          }
        },
      );
    },
    { prefix: "/hotp" },
  );
};

export default hotp;
