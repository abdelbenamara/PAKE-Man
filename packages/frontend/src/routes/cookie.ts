/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   cookie.ts                                          :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: abenamar <abenamar@student.42.fr>          +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2025/07/14 17:51:19 by abenamar          #+#    #+#             */
/*   Updated: 2025/08/17 18:21:12 by abenamar         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

import {
  cookieConsentCookieName,
  directoryPath,
  routeHandler,
} from "#utils/views.js";
import { FastifyPluginAsync } from "fastify";
import { resolve } from "node:path";

const cookie: FastifyPluginAsync = async (scope) => {
  scope.register(
    async (scope) => {
      const path = resolve(directoryPath, "cookie");

      scope
        .post(
          "/banner",
          { schema: { tags: ["cookie"] } },
          async (req, reply) => {
            try {
              if (
                cookieConsentCookieName in req.cookies &&
                req.unsignCookie(req.cookies[cookieConsentCookieName]!).valid
              ) {
                return reply.code(202).send();
              }

              return routeHandler(path, "banner")(req, reply);
            } catch (err) {
              return reply.send(err);
            }
          },
        )
        .post(
          "/consent",
          { schema: { tags: ["cookie"] } },
          async (_req, reply) => {
            return reply
              .code(201)
              .cookie(cookieConsentCookieName, "true")
              .send();
          },
        );
    },
    { prefix: "/cookie" },
  );
};

export default cookie;
