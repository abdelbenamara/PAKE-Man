/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   google.ts                                          :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: abenamar <abenamar@student.42.fr>          +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2025/05/14 10:14:01 by abenamar          #+#    #+#             */
/*   Updated: 2025/06/02 20:26:17 by abenamar         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

import { User } from "#generated/prisma";
import { jwt } from "#plugins/jwt.js";
import { FastifyInstance, FastifyPluginAsync } from "fastify";

type GoogleUserInfo = {
  sub: string;
  picture: string;
  email: string;
  email_verified: boolean;
};

async function getUserFromGoogleInfo(
  fastify: FastifyInstance,
  info: Readonly<GoogleUserInfo>
) {
  if (!info.email_verified) {
    throw fastify.httpErrors.forbidden(
      "Google sign-in require a verified email address"
    );
  }

  const user = ((await fastify.prisma.user.findUnique({
    where: {
      google_sub: info.sub,
    },
  })) || {}) as Partial<User>;

  if (!user.unique_id) {
    const last = (await fastify.prisma.user.findFirst({
      select: {
        id: true,
      },
      orderBy: {
        id: "desc",
      },
    })) || { id: 0 };

    Object.assign(
      user,
      await fastify.prisma.user.create({
        data: {
          google_sub: info.sub,
          picture: info.picture,
          email: info.email,
          name: "Player#" + (last.id + 1),
        },
      })
    );
  }

  const data: Partial<Pick<User, "email">> = Object.assign({}, user);

  if (info.email === data.email) {
    delete data.email;
  }

  return await fastify.prisma.user.update({
    where: {
      unique_id: user.unique_id,
    },
    data,
  });
}

const google = (async (scope) => {
  scope.register(
    async (scope) => {
      scope.get(
        "/callback",
        {
          schema: {
            tags: ["auth"],
          },
        },
        async (req, reply) => {
          try {
            const oauth2 =
              await scope.oauth2Google!.getAccessTokenFromAuthorizationCodeFlow(
                req,
                reply
              );
            const payload: jwt.UserInfo = Object.assign(
              {},
              await getUserFromGoogleInfo(
                scope,
                (await scope.oauth2Google!.userinfo(
                  oauth2.token
                )) as Readonly<GoogleUserInfo>
              )
            );
            const accessToken = jwt.setAccessToken(scope, reply, payload);
            const csrfToken = reply.generateCsrf({ userInfo: payload.name });

            return reply.send({ accessToken, csrfToken });
          } catch (err) {
            return reply.send(err);
          }
        }
      );
    },
    { prefix: "/google" }
  );
}) as FastifyPluginAsync;

export default google;
