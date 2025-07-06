/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   user.ts                                            :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: abenamar <abenamar@student.42.fr>          +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2025/07/06 21:27:02 by abenamar          #+#    #+#             */
/*   Updated: 2025/07/07 00:12:09 by abenamar         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

import fetch from "cross-fetch";
import { FastifyPluginAsync } from "fastify";

const user: FastifyPluginAsync = async (scope) => {
  scope.register(
    async (scope) => {
      scope.get("", {}, async (req, reply) => {
        const response = await fetch(
          process.env.PAKE_MAN_BACKEND_URL! + "/api/v1/users/me",
          {
            headers: {
              Authorization: req.headers.authorization!,
              "x-csrf-token": req.headers["x-csrf-token"] as string,
              Cookie: req.headers.cookie as string,
            },
          },
        );

        if (!response.ok) {
          return reply.unauthorized();
        }

        const user = await response.json();

        return reply.html`
          <!-- User Profile Picture and Name -->
          <div class="flex items-center">
            <img src="${user.picture}" alt="Profile Picture" class="w-8 h-8 rounded-full mr-2" />
            <span class="text-gray-700 font-medium">${user.name}</span>
          </div>
        `;
      });
    },
    { prefix: "/user" },
  );
};

export default user;
