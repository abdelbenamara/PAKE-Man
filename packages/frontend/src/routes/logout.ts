/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   logout.ts                                          :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: abenamar <abenamar@student.42.fr>          +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2025/07/08 13:01:16 by abenamar          #+#    #+#             */
/*   Updated: 2025/07/09 12:48:22 by abenamar         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

import { api } from "#utils/api.js";
import { FastifyPluginAsync } from "fastify";

const logout: FastifyPluginAsync = async (scope) => {
  scope.register(
    async (scope) => {
      scope.post("", async (req, reply) => {
        const response = await api.post("/api/v1/auth/logout", req.headers);

        reply.code(response.status).header("HX-Location", "/home");

        for (const item of response.headers.getSetCookie()) {
          reply.header("Set-Cookie", item);
        }

        return reply.send();
      });
    },
    { prefix: "/logout" },
  );
};

export default logout;
