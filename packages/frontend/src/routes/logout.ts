/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   logout.ts                                          :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: abenamar <abenamar@student.42.fr>          +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2025/07/08 13:01:16 by abenamar          #+#    #+#             */
/*   Updated: 2025/08/18 01:20:36 by abenamar         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

import { accessTokenCookieName, refreshTokenCookieName } from "#utils/api.js";
import { FastifyPluginAsync } from "fastify";

const logout: FastifyPluginAsync = async (scope) => {
  scope.register(
    async (scope) => {
      scope.post("", { schema: { tags: ["auth"] } }, async (_req, reply) => {
        return reply
          .code(204)
          .clearCookie(accessTokenCookieName)
          .clearCookie(refreshTokenCookieName)
          .header("HX-Location", "/")
          .send();
      });
    },
    { prefix: "/logout" },
  );
};

export default logout;
