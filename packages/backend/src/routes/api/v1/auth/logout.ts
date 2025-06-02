/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   logout.ts                                          :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: abenamar <abenamar@student.42.fr>          +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2025/05/31 15:44:25 by abenamar          #+#    #+#             */
/*   Updated: 2025/06/02 20:26:52 by abenamar         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

import { csrf } from "#plugins/csrf-protection.js";
import { jwt } from "#plugins/jwt.js";
import { FastifyPluginAsync } from "fastify";

const logout = (async (scope) => {
  scope.register(
    async (scope) => {
      scope.get(
        "",
        {
          onRequest: [scope.verifyAccessToken, scope.csrfProtection],
          schema: {
            security: [{ bearerAuth: [], csrfAuth: [] }],
            tags: ["auth"],
          },
        },
        async (req, reply) => {
          return reply
            .clearCookie(jwt.refreshTokenCookieName)
            .clearCookie(csrf.cookieName)
            .send({
              message: req.user.name + " successfully logged out.",
            });
        }
      );
    },
    { prefix: "/logout" }
  );
}) as FastifyPluginAsync;

export default logout;
