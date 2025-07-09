/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   logout.ts                                          :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: abenamar <abenamar@student.42.fr>          +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2025/05/31 15:44:25 by abenamar          #+#    #+#             */
/*   Updated: 2025/07/09 01:08:09 by abenamar         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

import { csrf } from "#plugins/csrf-protection.js";
import { jwt } from "#plugins/jwt.js";
import { auth } from "#utils/auth.js";
import { FastifyPluginAsync } from "fastify";

const logout = (async (scope) => {
  scope.register(
    async (scope) => {
      scope.post(
        "",
        {
          onRequest: [scope.authenticateAccessJwt, scope.csrfProtection],
          schema: {
            security: [{ bearerAuth: [], csrfAuth: [] }],
            tags: ["auth"],
            response: {
              204: {
                description: "Successful response",
              },
              ...auth.unauthorizedResponseSchema,
              ...auth.internalServerErrorResponseSchema,
            },
          },
        },
        async (_req, reply) => {
          return reply
            .clearCookie(csrf.cookieName)
            .clearCookie(jwt.cookieName)
            .code(204)
            .send();
        },
      );
    },
    { prefix: "/logout" },
  );
}) as FastifyPluginAsync;

export default logout;
