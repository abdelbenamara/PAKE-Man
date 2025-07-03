/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   hotp.ts                                            :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: abenamar <abenamar@student.42.fr>          +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2025/06/23 20:55:07 by abenamar          #+#    #+#             */
/*   Updated: 2025/07/04 01:12:18 by abenamar         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

import { jwt } from "#plugins/jwt.js";
import { auth } from "#utils/auth.js";
import { FastifyPluginAsync } from "fastify";

const hotp: FastifyPluginAsync = async (scope) => {
  scope.register(
    async (scope) => {
      scope.post(
        "/verify",
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
            },
          },
        },
        async (req, reply) => {
          try {
            const { code } = req.body as { code: string };

            if (req.hotpValidate({ token: code }) === null) {
              return reply.unauthorized().send({ error: "Invalid HOTP code" });
            }

            const accessToken = await jwt.setAccessToken(reply, req.user!);

            return auth.successful(scope, req, reply, accessToken);
          } catch (err) {
            return reply.send(err);
          }
        }
      );
    },
    { prefix: "/hotp" }
  );
};

export default hotp;
