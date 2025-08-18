/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   email.ts                                           :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: abenamar <abenamar@student.42.fr>          +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2025/07/13 21:26:11 by abenamar          #+#    #+#             */
/*   Updated: 2025/08/18 01:17:48 by abenamar         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

import { post } from "#utils/api.js";
import {
  directoryPath,
  indexLayout,
  routeHandler,
  unauthorized,
} from "#utils/views.js";
import { FastifyPluginAsync } from "fastify";
import { resolve } from "node:path";

const email: FastifyPluginAsync = async (scope) => {
  scope.register(
    async (scope) => {
      scope.addLayout(indexLayout(scope), {
        skipOnHeader: "hx-request",
      });

      const path = resolve(directoryPath, "email");

      scope
        .get<{ Querystring: { token: string } }>(
          "/verification",
          { schema: { tags: ["email"] } },
          async (req, reply) => {
            const response = await fetch(
              process.env.PAKE_MAN_BACKEND_URL! + "/api/v1/email/verification",
              {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({
                  token: req.query.token,
                }),
              },
            );

            if (!response.ok) {
              return unauthorized(req, reply);
            }

            return routeHandler(path, "verification")(req, reply);
          },
        )
        .post(
          "/verification/link",
          { schema: { tags: ["email"] } },
          async (req, reply) => {
            const response = await post("/api/v1/email/verification/link", req);

            if (!response.ok) {
              return unauthorized(req, reply);
            }

            return reply.html`<p class="text-sm text-green-700">Verification email sent.</p>`;
          },
        )
        .post(
          "/mfa/disable",
          { schema: { tags: ["email"] } },
          async (req, reply) => {
            const response = await post("/api/v1/email/hotp/disable", req);

            if (!response.ok) {
              return unauthorized(req, reply);
            }

            return reply.html`<p class="text-sm text-green-700">2FA disabled.</p>`;
          },
        );
    },
    { prefix: "/email" },
  );
};

export default email;
